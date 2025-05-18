import { appendFile, writeFile } from "node:fs";
import { EOL } from "node:os";
import { info, setFailed } from "@actions/core";

function envContentFromMap(
    contentMap: Map<string, string>,
    outputPrefix: string,
): string {
    info("Converting env content map to array");

    const envFileArray: string[] = [];
    for (const [key, value] of contentMap) {
        const envValue = value.includes("\n") ? `"${value}"` : value;
        const envLine = `${outputPrefix}${key}=${envValue}`;
        envFileArray.push(envLine);
    }

    info("Converting env array into string");

    const envContent = envFileArray.join(EOL);
    return envContent;
}

export async function writeToFile(
    envFilePath: string,
    contentMap: Map<string, string>,
    outputPrefix: string,
    writeMode: string,
): Promise<void> {
    const envFileContent = envContentFromMap(contentMap, outputPrefix);

    info(`Writing env content to file ${envFilePath}`);

    if (writeMode === "overwrite") {
        writeFile(envFilePath, envFileContent, (err) => {
            if (err) {
                setFailed(err);
            }
        });
    } else if (writeMode === "append") {
        appendFile(envFilePath, envFileContent, (err) => {
            if (err) {
                setFailed(err);
            }
        });
    } else {
        setFailed(
            "Only two mode or write mode is supported overwrite or append",
        );
    }
}
