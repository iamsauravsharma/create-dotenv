import * as core from "@actions/core";

export interface Input {
    envPrefix: string;
    fileName: string;
    directory: string;
}

export function readInput(): Input {
    core.info("Reading input parameters");

    const envPrefix = core.getInput("env-prefix");
    const fileName = core.getInput("file-name");
    const directory = core.getInput("directory");
    const inputContent: Input = { envPrefix, fileName, directory };
    return inputContent;
}
