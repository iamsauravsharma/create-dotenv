import * as core from "@actions/core";
import * as fs from "fs";
import * as os from "os";

function envContentFromMap(contentMap: Map<string, string>): string {
    let envFileArray: Array<string> = new Array();
    for (const [key, value] of contentMap) {
        const envLine = key + "=" + value;
        envFileArray.push(envLine);
    }
    const envContent = envFileArray.join(os.EOL);
    return envContent;
}

export async function writeToFile(
    envFilePath: string,
    contentMap: Map<string, string>
): Promise<void> {
    const envFileContent = envContentFromMap(contentMap);
    fs.writeFile(envFilePath, envFileContent, (err) => {
        if (err) {
            core.setFailed(err);
        }
    });
}
