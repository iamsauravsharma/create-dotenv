import { afterEach, describe, expect, test } from "vitest";
import { readInput } from "../src/input";

const INPUT_KEYS = [
    "INPUT_INPUT-PREFIX",
    "INPUT_FILE-PATH",
    "INPUT_OUTPUT-PREFIX",
    "INPUT_WRITE-MODE",
];

afterEach(() => {
    for (const key of INPUT_KEYS) {
        delete process.env[key];
    }
});

describe("readInput", () => {
    test("reads all action inputs", () => {
        process.env["INPUT_INPUT-PREFIX"] = "ENV_KEY_";
        process.env["INPUT_FILE-PATH"] = "tests/development.env";
        process.env["INPUT_OUTPUT-PREFIX"] = "OUTPUT_";
        process.env["INPUT_WRITE-MODE"] = "append";
        expect(readInput()).toEqual({
            inputPrefix: "ENV_KEY_",
            filePath: "tests/development.env",
            outputPrefix: "OUTPUT_",
            writeMode: "append",
        });
    });

    test("throws on an unsupported write-mode", () => {
        process.env["INPUT_WRITE-MODE"] = "bogus";
        expect(() => readInput()).toThrow(/Unsupported write-mode "bogus"/);
    });
});
