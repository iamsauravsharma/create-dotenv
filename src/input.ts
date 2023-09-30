import { info, getInput } from "@actions/core";

export interface Input {
    inputPrefix: string;
    filePath: string;
    outputPrefix: string;
}

export function readInput(): Input {
    info("Reading input parameters");

    const inputPrefix = getInput("input-prefix");
    const filePath = getInput("file-path");
    const outputPrefix = getInput("output-prefix");
    return { inputPrefix, filePath, outputPrefix } as Input;
}
