import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";

async function run(): Promise<void> {
    const envPrefix = core.getInput("env-prefix");
    const fileName = core.getInput("file-name");
    const directory = core.getInput("directory");

    const env = process.env;

    let envFileContent = "";
    for (const [key, value] of Object.entries(env)) {
        if (key.startsWith(envPrefix)) {
            const regex = RegExp(`^${envPrefix}`);

            const envKeyName = key.replace(regex, "");
            const envKeyValue = String(value);

            envFileContent = envFileContent.concat(
                envKeyName,
                "=",
                envKeyValue,
                "\n"
            );
        }
    }

    const envFilePath = path.join(directory, fileName);
    const envFullPath = path.resolve(envFilePath);

    fs.writeFile(envFilePath, envFileContent, (err) => {
        if (err) {
            core.setFailed(`Action failed with error ${err}`);
        }
    });

    core.setOutput("env-file", envFullPath);
}

run();
