import {
    getInput as coreGetInput,
    setOutput as coreSetOutput,
    setFailed as coreSetFailed,
} from "@actions/core";
import { writeFile as fsWriteFile } from "fs";
import { join as pathJoin, resolve as pathResolve } from "path";

async function run(): Promise<void> {
    const envPrefix = coreGetInput("env-prefix");
    const fileName = coreGetInput("file-name");
    const directory = coreGetInput("directory");

    const env = process.env;

    let envFileContent = "";

    for (const key of Object.keys(env)) {
        if (key.startsWith(envPrefix)) {
            const regex = RegExp(`^${envPrefix}`);

            const envKeyName = key.replace(regex, "");
            const envKeyValue = String(env[key]);

            envFileContent = envFileContent.concat(
                envKeyName,
                "=",
                envKeyValue,
                "\n"
            );
        }
    }

    const envFilePath = pathJoin(directory, fileName);
    const envFullPath = pathResolve(envFilePath);

    fsWriteFile(envFilePath, envFileContent, (err) => {
        if (err) {
            coreSetFailed(`Action failed with error ${err}`);
        }
    });

    coreSetOutput("env-file", envFullPath);
}

run();
