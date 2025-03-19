import { $ } from "bun";
import { join, dirname, basename, extname } from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import archiver from "archiver";
import { createWriteStream } from "fs";

/**
 * Converts a Putty PPK key to OpenSSH format, zips the result, and cleans up
 * @param ppkPath Absolute path to the PPK key file
 * @returns Absolute path to the zipped file containing the converted keys
 */
export async function convertPuttyKeyToOpenSSH(ppkPath: string): Promise<string> {
    const keyName = basename(ppkPath, extname(ppkPath));
    const convertedDir = join(dirname(ppkPath), "../converted");

    // Create converted directory if it doesn't exist
    await mkdir(convertedDir, { recursive: true });

    const privateKeyPath = join(convertedDir, `${keyName}`);
    const publicKeyPath = join(convertedDir, `${keyName}.pub`);

    // Convert private key
    await $`puttygen '${ppkPath}' -O private-openssh -o '${privateKeyPath}'`;

    // Convert public key
    await $`puttygen '${ppkPath}' -O public-openssh -o '${publicKeyPath}'`;

    // Create zip file
    const archive = archiver("zip", {
        zlib: { level: 9 },
    });

    // Throw zip error if anything
    archive.on("error", function (err) {
        throw err;
    });

    // Create write stream
    const zipPath = join(convertedDir, `${keyName}.zip`);
    const output = createWriteStream(zipPath);

    // Connect to write stream, and pipe data into it
    archive.pipe(output);

    // Important: Create a promise that resolves when the output stream is closed
    const streamFinished = new Promise<void>((resolve, reject) => {
        output.on("close", () => resolve());
        output.on("error", reject);
        archive.on("error", reject);
    });

    // Add two files
    const keyNameWithoutUUID = keyName.split("_")[1];
    archive.file(privateKeyPath, { name: keyNameWithoutUUID });
    archive.file(publicKeyPath, { name: keyNameWithoutUUID + ".pub" });

    await archive.finalize();
    await streamFinished; // wait for zip file to be fully made

    // Delete zipped files
    await unlink(privateKeyPath);
    await unlink(publicKeyPath);
    await unlink(ppkPath);

    return zipPath;
}
