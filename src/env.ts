import { info } from "@actions/core";

export function readEnv(envPrefix: string): Map<string, string> {
    const env = process.env;

    const envFileMap: Map<string, string> = new Map();

    info("Reading environmental variable");

    for (const [key, value] of Object.entries(env)) {
        if (value) {
            if (envPrefix) {
                if (key.startsWith(envPrefix)) {
                    const regex = RegExp(`^${envPrefix}`);
                    const envKeyName = key.replace(regex, "");
                    envFileMap.set(envKeyName, value);
                }
            } else {
                const preDefinedEnvPrefix = ["GITHUB_", "RUNNER_"];
                if (!preDefinedEnvPrefix.some((prefix) => key.startsWith(prefix))) {
                    envFileMap.set(key, value);
                }
            }
        }
    }
    return envFileMap;
}
