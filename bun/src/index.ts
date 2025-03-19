import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { basename, join, resolve } from "node:path";
import { v4 as uuidv4 } from "uuid";
import { convertPuttyKeyToOpenSSH } from "../utils/convert";
import { unlink } from "fs/promises";

const app = new Hono();
const maxFileSize = Number(process.env.MAX_FILE_UPLOAD_MB);

const UploadScheme = z.object({
    key: z
        .instanceof(File, { message: "Please select a file" })
        .refine((file) => file.size <= maxFileSize * 1024 * 1024, {
            message: `File must be below ${maxFileSize} MB`,
        })
        .refine((file) => file.name.split(".").pop()?.toLowerCase() === "ppk", {
            message: "File must be putty format (.ppk)",
        }),
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend
    })
);

app.post("/convert", zValidator("form", UploadScheme), async (c) => {
    // Get body info
    const body = await c.req.parseBody();

    // Ensure 'file' is treated as a File object, and convert it to ArrayBuffer for saving
    const file = body.key as File;
    const arrayBuffer = await file.arrayBuffer();

    // Write file to uploads dir
    const newFileName = `${uuidv4()}_${file.name}`;
    const path = join(__dirname, "../uploads/", newFileName);
    await Bun.write(path, arrayBuffer);

    try {
        // convert file to open ssh file
        const zippedPath = await convertPuttyKeyToOpenSSH(resolve(path));

        // Return zip file to the frontend
        const zipFile = await Bun.file(zippedPath).arrayBuffer();
        const normalFileName = basename(zippedPath).split("_")[1];

        // After we have zip file in the memory, lets delete it from filesystem
        await unlink(zippedPath);

        return new Response(zipFile, {
            headers: {
                "Content-type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${normalFileName}"`,
            },
        });
    } catch (err) {
        if (err instanceof Error) {
            return c.json({ success: false, error: { ...err } });
        }
    }
});

export default app;
