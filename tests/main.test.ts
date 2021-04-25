import { stat as fsStat } from "fs";
import { resolve as pathResolve } from "path";

test("test if env file exists", async () => {
    const envFilePath = pathResolve(__dirname, "development.env");
    fsStat(envFilePath, (err, _stats) => {
        if (err) {
            console.error(err);
        }
    });
});

test("test if output value from action is same file as expected", async () => {
    const envFilePath = pathResolve(__dirname, "development.env");
    const envFileLocation = String(process.env["ENV_FILE"]);
    expect(envFileLocation).toBe(envFilePath);
});
