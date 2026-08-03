import { readFileSync } from "node:fs";
import * as path from "node:path";
import dotenv from "dotenv";
import { expect, test } from "vitest";

const writeMode = process.env.WRITE_MODE ?? "overwrite";

const envFilePath = path.resolve(__dirname, "development.env");

const actionEntries = {
    OUTPUT_PROJECT_NAME: "dot-env",
    OUTPUT_DEBUG: "true",
    OUTPUT_USERNAME: "admin",
    OUTPUT_API_KEY: "USER_API_KEY",
    OUTPUT_SECRET_KEY: "secret123",
    OUTPUT_ENV_KEY_MULTIPLE: "test",
    OUTPUT_WITH_QUOTE: "quote_value",
    OUTPUT_WITH_START_QUOTE: '"quote',
    OUTPUT_WITH_NON_START_QUOTE: 'quote"_value"',
    OUTPUT_FULLY_QUOTED: '"hello"',
    OUTPUT_WITH_HASH: "pass#word",
    OUTPUT_WITH_SPACES: "  padded  ",
    OUTPUT_WITH_SINGLE_QUOTE: "it's a value",
    OUTPUT_WITH_BOTH_QUOTES: `it's "quoted"`,
    OUTPUT_WITH_BACKTICK: "back`tick",
    OUTPUT_WITH_EQUALS: "a=b=c",
    OUTPUT_JSON: '{"key": "value"}',
    OUTPUT_WINDOWS_PATH: "C:\\Users\\test\\bin",
    OUTPUT_URL: "https://user:pass@example.com/path?a=1&b=2",
    OUTPUT_MULTILINE: "some multiline\nstring here\n",
};

test.runIf(writeMode === "overwrite")(
    "overwrite mode: file contains exactly the values provided to the action",
    () => {
        const parsed = dotenv.parse(readFileSync(envFilePath, "utf8"));
        expect(parsed).toEqual(actionEntries);
    },
);

test.runIf(writeMode === "append")(
    "append mode: pre-seeded entries survive and appended values win for duplicate keys",
    () => {
        const content = readFileSync(envFilePath, "utf8");

        expect(content).toContain("OUTPUT_USERNAME=root");
        expect(content).toContain("OUTPUT_SEEDED=initial_value");

        const parsed = dotenv.parse(content);
        expect(parsed).toEqual({
            ...actionEntries,
            OUTPUT_SEEDED: "initial_value",
        });
    },
);
