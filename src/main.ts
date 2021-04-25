import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";

const envPrefix = core.getInput("env-prefix");
const fileName = core.getInput("file-name");
const directory = core.getInput("directory");

const env = process.env;

let envFileContent = "";

for (const key of Object.keys(env)) {
    if (key.startsWith(envPrefix)) {
        const regexExpression = "^" + key;
        const regex = RegExp(regexExpression);

        const envKeyName = key.replace(regex, "");
        const envKeyValue = env[key] as string;

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

fs.writeFileSync(envFilePath, envFileContent);

core.setOutput("env-file", envFullPath);
