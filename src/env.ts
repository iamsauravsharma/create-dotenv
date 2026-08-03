import { info } from "@actions/core";

/**
 * Reads environmental variables and returns a map of key-value pairs.
 * @param envPrefix - The prefix to filter environmental variables.
 * @returns A map of environmental variable key-value pairs.
 */
export function readEnv(envPrefix: string): Map<string, string> {
    const env = process.env;

    const envFileMap: Map<string, string> = new Map();

    info("Reading environmental variable");

    // Iterate through the environmental variables and filter based on the provided prefix
    for (const [key, value] of Object.entries(env)) {
        if (value) {
            if (envPrefix) {
                if (key.startsWith(envPrefix)) {
                    const envKeyName = key.slice(envPrefix.length);
                    envFileMap.set(envKeyName, value);
                }
            } else {
                // If no prefix is provided ignores predefined environment variables that start with "GITHUB_" or "RUNNER_"
                const preDefinedEnvPrefix = ["GITHUB_", "RUNNER_"];
                if (
                    !preDefinedEnvPrefix.some((prefix) =>
                        key.startsWith(prefix),
                    )
                ) {
                    envFileMap.set(key, value);
                }
            }
        }
    }
    return envFileMap;
}
