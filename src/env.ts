import { info } from "@actions/core";

export function readEnv(envPrefix: string): Map<string, string> {
    const env = process.env;

    const envFileMap: Map<string, string> = new Map();

    info("Reading environmental variable");

    for (const [key, value] of Object.entries(env)) {
        if (key.startsWith(envPrefix)) {
            const regex = RegExp(`^${envPrefix}`);

            const envKeyName = key.replace(regex, "");
            const envKeyValue = String(value);
            envFileMap.set(envKeyName, envKeyValue);
        }
    }
    return envFileMap;
}
