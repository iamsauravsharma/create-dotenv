import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

test("test if env file value matched with actual value", async () => {
    const envFilePath = path.resolve(__dirname, "development.env");
    const expectedMap = new Map([
        ["OUTPUT_PROJECT_NAME", "dot-env"],
        ["OUTPUT_DEBUG", "true"],
        ["OUTPUT_USERNAME", "admin"],
        ["OUTPUT_API_KEY", "USER_API_KEY"],
        ["OUTPUT_SECRET_KEY", "secret123"],
        ["OUTPUT_ENV_KEY_MULTIPLE", "test"],
    ]);
    let actualMap: Map<string, string> = new Map();
    const readLineInterface = readline.createInterface({
        input: fs.createReadStream(envFilePath),
        crlfDelay: Infinity,
    });
    for await (const line of readLineInterface) {
        const splitLine = line.split("=");
        if (splitLine.length != 2) {
            continue;
        }
        actualMap.set(splitLine[0], splitLine[1]);
    }
    if (actualMap.size != expectedMap.size) {
        console.log(`Expected: ${[...expectedMap.entries()]}`);
        console.log(`Actual: ${[...expectedMap.entries()]}`);
        throw new Error("Size of two map doesn't matched");
    }
    for (const [key, val] of expectedMap) {
        const actualValue = actualMap.get(key);
        if (actualValue != val) {
            console.log(`Expected: ${[...expectedMap.entries()]}`);
            console.log(`Actual: ${[...expectedMap.entries()]}`);
            throw new Error("Value doesn't matched");
        }
    }
});
