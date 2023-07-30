import { info, setOutput } from "@actions/core";
import { join, resolve } from "path";

import { Input, readInput } from "./input";

import { readEnv } from "./env";
import { writeToFile } from "./file";

async function run(): Promise<void> {
    const input: Input = readInput();

    const envFileMap = readEnv(input.envPrefix);

    const envFilePath = join(input.directory, input.fileName);
    const envFullPath = resolve(envFilePath);

    await writeToFile(envFilePath, envFileMap);

    info(`Setting env-file output as ${envFullPath}`);

    setOutput("env-file", envFullPath);
}

run();
