import * as core from "@actions/core";
import * as path from "path";

import { Input, readInput } from "./input";

import { readEnv } from "./env";
import { writeToFile } from "./file";

async function run(): Promise<void> {
    const input: Input = readInput();

    const envFileMap = readEnv(input.envPrefix);

    const envFilePath = path.join(input.directory, input.fileName);
    const envFullPath = path.resolve(envFilePath);

    await writeToFile(envFilePath, envFileMap);

    core.info(`Setting env-file output as ${envFullPath}`);

    core.setOutput("env-file", envFullPath);
}

run();
