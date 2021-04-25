import * as fs from "fs";

test("test if env file exists", async () => {
    const envFilePath = "tests/development.env";
    fs.stat(envFilePath, (err, _stats) => {
        if (err) {
            console.error(err);
        }
    });
});
