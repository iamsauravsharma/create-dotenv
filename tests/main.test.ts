import * as path from "node:path";
import dotenv from "dotenv";
import { test } from "vitest";

test("test if env file value matched with actual value", async () => {
    const envFilePath = path.resolve(__dirname, "development.env");
    const expectedMap = new Map([
        ["OUTPUT_PROJECT_NAME", "dot-env"],
        ["OUTPUT_DEBUG", "true"],
        ["OUTPUT_USERNAME", "admin"],
        ["OUTPUT_API_KEY", "USER_API_KEY"],
        ["OUTPUT_SECRET_KEY", "secret123"],
        ["OUTPUT_ENV_KEY_MULTIPLE", "test"],
        ["OUTPUT_WITH_QUOTE", "quote_value"],
        ["OUTPUT_WITH_START_QUOTE", '"quote'],
        ["OUTPUT_WITH_NON_START_QUOTE", 'quote"_value"'],
        ["OUTPUT_MULTILINE", "some multiline\nstring here\n"],
    ]);
    const processedEnv = {};
    dotenv.config({ path: envFilePath, processEnv: processedEnv });
    const actualMap = new Map(Object.entries(processedEnv));

    if (actualMap.size !== expectedMap.size) {
        console.log(`Expected: ${[...expectedMap.entries()]}`);
        console.log(`Actual: ${[...actualMap.entries()]}`);
        throw new Error("Size of two map is not same");
    }
    for (const [key, val] of expectedMap) {
        const actualValue = actualMap.get(key);
        if (actualValue !== val) {
            console.log(`Expected: ${val}`);
            console.log(`Actual: ${actualValue}`);
            throw new Error(`${key} value is different with each other`);
        }
    }
});
