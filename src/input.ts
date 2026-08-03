import { getInput, info } from "@actions/core";

export type WriteMode = "overwrite" | "append";

/**
 * Represents the input parameters for the GitHub Actions workflow.
 */
export interface Input {
    // The prefix for the input parameters to be read from the environment variables.
    inputPrefix: string;
    // The file path where the output will be written.
    filePath: string;
    // The prefix for the output parameters to be written to the file.
    outputPrefix: string;
    // The write mode for the output file, either "overwrite" or "append".
    writeMode: WriteMode;
}

/**
 * Parses the write mode input parameter and returns the corresponding WriteMode value.
 * @param value The write mode input parameter value.
 * @returns The corresponding WriteMode value.
 * @throws An error if the input value is not "overwrite" or "append".
 */
function parseWriteMode(value: string): WriteMode {
    if (value === "overwrite" || value === "append") {
        return value;
    }
    throw new Error(
        `Unsupported write-mode "${value}": only "overwrite" and "append" are supported`,
    );
}

/**
 * Reads the input parameters from the GitHub Actions workflow.
 * @returns The input parameters as an Input object.
 */
export function readInput(): Input {
    info("Reading input parameters");

    return {
        inputPrefix: getInput("input-prefix"),
        filePath: getInput("file-path"),
        outputPrefix: getInput("output-prefix"),
        writeMode: parseWriteMode(getInput("write-mode")),
    };
}
