import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import dotenv from "dotenv";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { writeToFile } from "../src/file";

let tempDir: string;

beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "create-dotenv-test-"));
});

afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
});

async function roundTrip(
    contentMap: Map<string, string>,
    outputPrefix = "",
): Promise<Record<string, string>> {
    const filePath = path.join(tempDir, ".env");
    await writeToFile(filePath, contentMap, outputPrefix, "overwrite");
    return dotenv.parse(await readFile(filePath, "utf8"));
}

describe("value quoting round-trips through dotenv", () => {
    const cases: [string, string][] = [
        ["simple value", "hello"],
        ["empty value", ""],
        ["fully double-quoted value", '"hello"'],
        ["value starting with a double quote", '"quote'],
        ["value with inner double quotes", 'quote"_value"'],
        ["value containing a hash", "pass#word"],
        ["value with leading and trailing whitespace", "  padded  "],
        ["value with single quotes", "it's a value"],
        ["value with single and double quotes", `it's "quoted"`],
        ["value with backticks", "back`tick"],
        ["multiline value", "some multiline\nstring here\n"],
        ["multiline value with carriage returns", "line1\r\nline2"],
        ["value with equals signs", "a=b=c"],
    ];

    test.each(cases)("%s", async (_name, value) => {
        const parsed = await roundTrip(new Map([["KEY", value]]));
        expect(parsed.KEY).toBe(value);
    });

    test("corruption-prone value does not affect surrounding entries", async () => {
        const parsed = await roundTrip(
            new Map([
                ["BEFORE", "first"],
                ["MIXED", 'multi\nline "with" quotes'],
                ["AFTER", "last"],
            ]),
        );
        expect(parsed.BEFORE).toBe("first");
        expect(parsed.AFTER).toBe("last");
        expect(parsed.MIXED).toContain("multi\nline");
    });

    test("output prefix is prepended to every key", async () => {
        const parsed = await roundTrip(
            new Map([
                ["FIRST", "1"],
                ["SECOND", "2"],
            ]),
            "OUTPUT_",
        );
        expect(parsed).toEqual({ OUTPUT_FIRST: "1", OUTPUT_SECOND: "2" });
    });
});

describe("write modes", () => {
    test("overwrite mode replaces existing content", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeFile(filePath, "OLD=stale\n");
        await writeToFile(
            filePath,
            new Map([["NEW", "fresh"]]),
            "",
            "overwrite",
        );
        const parsed = dotenv.parse(await readFile(filePath, "utf8"));
        expect(parsed).toEqual({ NEW: "fresh" });
    });

    test("append mode creates the file when it does not exist", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeToFile(filePath, new Map([["NEW", "value"]]), "", "append");
        const parsed = dotenv.parse(await readFile(filePath, "utf8"));
        expect(parsed).toEqual({ NEW: "value" });
    });

    test("append mode keeps existing entries", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeFile(filePath, "EXISTING=1\n");
        await writeToFile(filePath, new Map([["NEW", "2"]]), "", "append");
        const parsed = dotenv.parse(await readFile(filePath, "utf8"));
        expect(parsed).toEqual({ EXISTING: "1", NEW: "2" });
    });

    test("appending to a file without a trailing newline does not merge lines", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeFile(filePath, "EXISTING=1");
        await writeToFile(filePath, new Map([["NEW", "2"]]), "", "append");
        const parsed = dotenv.parse(await readFile(filePath, "utf8"));
        expect(parsed).toEqual({ EXISTING: "1", NEW: "2" });
    });

    test("appending to a file with a trailing newline does not insert a blank line", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeFile(filePath, "EXISTING=1\n");
        await writeToFile(filePath, new Map([["NEW", "2"]]), "", "append");
        const content = await readFile(filePath, "utf8");
        const emptyLines = content.split(/\r?\n/).filter((line) => line === "");
        expect(emptyLines).toHaveLength(1);
        expect(dotenv.parse(content)).toEqual({ EXISTING: "1", NEW: "2" });
    });

    test("consecutive appends keep every entry intact", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeToFile(filePath, new Map([["FIRST", "1"]]), "", "append");
        await writeToFile(filePath, new Map([["SECOND", "2"]]), "", "append");
        await writeToFile(filePath, new Map([["THIRD", "3"]]), "", "append");
        const parsed = dotenv.parse(await readFile(filePath, "utf8"));
        expect(parsed).toEqual({ FIRST: "1", SECOND: "2", THIRD: "3" });
    });

    test("appending an empty map leaves the file untouched", async () => {
        const filePath = path.join(tempDir, ".env");
        await writeFile(filePath, "EXISTING=1");
        await writeToFile(filePath, new Map(), "", "append");
        expect(await readFile(filePath, "utf8")).toBe("EXISTING=1");
    });
});
