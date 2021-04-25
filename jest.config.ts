import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
    return {
        preset: "ts-jest",
        testEnvironment: "node",
        verbose: true,
    };
};
