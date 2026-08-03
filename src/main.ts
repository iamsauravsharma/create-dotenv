import { setFailed } from "@actions/core";
import { readEnv } from "./env";
import { writeToFile } from "./file";
import { type Input, readInput } from "./input";

/**
 * The main function that orchestrates reading input parameters, reading environment variables,
 * and writing them to a file based on the specified write mode.
 */
async function run(): Promise<void> {
    const input: Input = readInput();

    const envFileMap = readEnv(input.inputPrefix);

    await writeToFile(
        input.filePath,
        envFileMap,
        input.outputPrefix,
        input.writeMode,
    );
}

run().catch((error: unknown) => {
    setFailed(error instanceof Error ? error : String(error));
});
