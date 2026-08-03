import { afterEach, describe, expect, test } from "vitest";
import { readEnv } from "../src/env";

const testKeys: string[] = [];

function setEnv(key: string, value: string): void {
    process.env[key] = value;
    testKeys.push(key);
}

afterEach(() => {
    for (const key of testKeys.splice(0)) {
        delete process.env[key];
    }
});

describe("readEnv", () => {
    test("strips the prefix from matching keys and skips others", () => {
        setEnv("CDT_PREFIX_NAME", "value");
        setEnv("CDT_OTHER", "ignored");
        const map = readEnv("CDT_PREFIX_");
        expect(map).toEqual(new Map([["NAME", "value"]]));
    });

    test("treats prefixes containing regex special characters literally", () => {
        setEnv("CDT+PLUS_KEY", "value");
        const map = readEnv("CDT+PLUS_");
        expect(map).toEqual(new Map([["KEY", "value"]]));
    });

    test("skips variables with empty values", () => {
        setEnv("CDT_EMPTY_FULL", "value");
        setEnv("CDT_EMPTY_NONE", "");
        const map = readEnv("CDT_EMPTY_");
        expect(map).toEqual(new Map([["FULL", "value"]]));
    });

    test("without a prefix excludes GITHUB_ and RUNNER_ variables", () => {
        setEnv("CDT_PLAIN", "kept");
        setEnv("GITHUB_CDT_TEST", "excluded");
        setEnv("RUNNER_CDT_TEST", "excluded");
        const map = readEnv("");
        expect(map.get("CDT_PLAIN")).toBe("kept");
        expect(map.has("GITHUB_CDT_TEST")).toBe(false);
        expect(map.has("RUNNER_CDT_TEST")).toBe(false);
    });
});
