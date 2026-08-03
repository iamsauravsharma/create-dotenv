import { appendFile, type FileHandle, open, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import { info } from "@actions/core";
import type { WriteMode } from "./input";

/**
 * Checks if the specified file ends without a newline character.
 * @param filePath The path to the file to check.
 * @returns A promise that resolves to true if the file ends without a newline, false otherwise.
 */
async function endsWithoutNewline(filePath: string): Promise<boolean> {
    let handle: FileHandle;
    try {
        handle = await open(filePath, "r");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return false;
        }
        throw error;
    }
    try {
        const { size } = await handle.stat();
        if (size === 0) {
            return false;
        }
        const lastByte = Buffer.alloc(1);
        // Read the last byte of the file to check if it's a newline character
        await handle.read(lastByte, 0, 1, size - 1);
        return lastByte[0] !== "\n".charCodeAt(0);
    } finally {
        await handle.close();
    }
}

/**
 * Formats the given environment variable value for writing to a file.
 * If the value contains special characters or whitespace, it will be quoted appropriately.
 * @param value The environment variable value to format.
 * @returns The formatted value as a string.
 */
function formatEnvValue(value: string): string {
    // Check if the value needs quoting (contains special characters or whitespace)
    const needsQuoting = /[\r\n#'"`]/.test(value) || value !== value.trim();
    if (!needsQuoting) {
        return value;
    }
    // Use double quotes if the value contains no double quotes, otherwise use single quotes or backticks
    if (!value.includes('"')) {
        return `"${value.replace(/\n/g, "\\n").replace(/\r/g, "\\r")}"`;
    }
    if (!value.includes("'") && !/[\r\n]/.test(value)) {
        return `'${value}'`;
    }
    if (!value.includes("`") && !/[\r\n]/.test(value)) {
        return `\`${value}\``;
    }
    // If the value contains all types of quotes, escape double quotes and use double quotes
    return `"${value
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")}"`;
}

/**
 * Converts a map of environment variable key-value pairs into a string suitable for writing to a file.
 * Each key-value pair is formatted as "key=value" and separated by newlines.
 * @param contentMap The map of environment variable key-value pairs.
 * @param outputPrefix The prefix to prepend to each key in the output.
 * @returns A string representation of the environment variables, ready to be written to a file.
 */
function envContentFromMap(
    contentMap: Map<string, string>,
    outputPrefix: string,
): string {
    info("Converting env content map to array");

    const envFileArray: string[] = [];
    for (const [key, value] of contentMap) {
        const envLine = `${outputPrefix}${key}=${formatEnvValue(value)}`;
        envFileArray.push(envLine);
    }

    info("Converting env array into string");

    if (envFileArray.length === 0) {
        return "";
    }
    return envFileArray.join(EOL) + EOL;
}

/**
 * Writes the given environment variable content to a file, either overwriting or appending based on the specified write mode.
 * @param envFilePath The path to the file where the content will be written.
 * @param contentMap A map of environment variable key-value pairs to write to the file.
 * @param outputPrefix The prefix to prepend to each key in the output.
 * @param writeMode The mode for writing to the file, either "overwrite" or "append".
 */
export async function writeToFile(
    envFilePath: string,
    contentMap: Map<string, string>,
    outputPrefix: string,
    writeMode: WriteMode,
): Promise<void> {
    const envFileContent = envContentFromMap(contentMap, outputPrefix);

    info(`Writing env content to file ${envFilePath}`);

    if (writeMode === "overwrite") {
        await writeFile(envFilePath, envFileContent);
    } else {
        const separator =
            envFileContent !== "" && (await endsWithoutNewline(envFilePath))
                ? EOL
                : "";
        await appendFile(envFilePath, separator + envFileContent);
    }
}
