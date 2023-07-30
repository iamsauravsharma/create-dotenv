import { info, setFailed } from "@actions/core";
import { writeFile } from "fs";
import { EOL } from "os";

function envContentFromMap(contentMap: Map<string, string>): string {
    info("Converting env content map to array");

    const envFileArray: string[] = [];
    for (const [key, value] of contentMap) {
        const envLine = `${key}=${value}`;
        envFileArray.push(envLine);
    }

    info("Converting env array into string");

    const envContent = envFileArray.join(EOL);
    return envContent;
}

export async function writeToFile(
    envFilePath: string,
    contentMap: Map<string, string>,
): Promise<void> {
    const envFileContent = envContentFromMap(contentMap);

    info(`Writing env content to file ${envFilePath}`);

    writeFile(envFilePath, envFileContent, (err) => {
        if (err) {
            setFailed(err);
        }
    });
}
