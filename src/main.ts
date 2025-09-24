import { readEnv } from "./env";
import { writeToFile } from "./file";
import { type Input, readInput } from "./input";

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

run();
