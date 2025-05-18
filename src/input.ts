import { getInput, info } from "@actions/core";

export interface Input {
    inputPrefix: string;
    filePath: string;
    outputPrefix: string;
    writeMode: string;
}

export function readInput(): Input {
    info("Reading input parameters");

    const inputPrefix = getInput("input-prefix");
    const filePath = getInput("file-path");
    const outputPrefix = getInput("output-prefix");
    const writeMode = getInput("write-mode");
    return { inputPrefix, filePath, outputPrefix, writeMode } as Input;
}
