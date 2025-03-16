import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();
const maxFileSize = Number(process.env.MAX_FILE_UPLOAD_MB);

interface UploadForm {
    key: File | null;
}

const FormScheme = z.object({
    key: z
        .instanceof(File, { message: "Please select a file" })
        .refine((file) => file.size <= maxFileSize * 1024 * 1024, {
            message: `File must be below ${maxFileSize} MB`,
        })
        .refine((file) => file.name.split(".").pop()?.toLowerCase() === "ppk", {
            message: "File must be putty format (.ppk)",
        }),
});

app.get("/", (c) => {
    console.log(c.body());
});

export default app;
