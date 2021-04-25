import * as fs from "fs";

test("test if env file matches", async () => {
    const expectedEnvFileContent = `
PROJECT_NAME=dotenv
USERNAME=admin
DEBUG=True
API_KEY=USER_API_KEY
SECRET_KEY=secrets123
`;
    const envFilePath = "tests/development.env";
    fs.readFile(envFilePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        } else {
            expect(data.trim()).toBe(expectedEnvFileContent.trim());
        }
    });
});
