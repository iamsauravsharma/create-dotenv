import { info, getInput } from "@actions/core";

export interface Input {
    envPrefix: string;
    fileName: string;
    directory: string;
}

export function readInput(): Input {
    info("Reading input parameters");

    const envPrefix = getInput("env-prefix");
    const fileName = getInput("file-name");
    const directory = getInput("directory");
    const inputContent: Input = { envPrefix, fileName, directory };
    return inputContent;
}
