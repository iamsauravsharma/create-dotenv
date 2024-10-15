# Create dotenv action

This action creates dotenv file

## Inputs

### `input-prefix`

The prefix for environmental variable which should be stored in dot env file. Default is empty string i.e `''` which will store all environmental variable as it is without modification expects environment variable which starts with prefix `GITHUB_` or `RUNNER_`. If you needs to also add `GITHUB_` or `RUNNER_` environment variable create another steps which has prefix set to `GITHUB_` or `RUNNER_`

### `file-path`

Location of dot env file. Default is `'.env'`

### `output-prefix`

The prefix which should be added to .env file. Default is `''` which adds environment variable as it is after removing input-prefix from it

## Example usage

```yaml
name: Create env file

on: [push]

env: # env available for all jobs all steps
  PRODUCTION: true
  ENV_KEY_PROJECT_NAME: dot-env

jobs:
  create-env-file:
    name: Create env file
    runs-on: ubuntu-latest
    env: # env available for all steps of jobs
      ENV_KEY_DEBUG: true
      ENV_KEY_USERNAME: root

    steps:
      - uses: actions/checkout@v4
      - uses: iamsauravsharma/create-dotenv@v3.0.0
        with:
          input-prefix: 'ENV_KEY_' # Optional (default: '')
          file-path: 'tests/development.env' # Optional (default : '.env')
          output-prefix: 'OUTPUT_' # Optional (default: '')
        env: # env available for only this steps
          IS_SERVER: true
          ENV_KEY_USERNAME: admin
          ENV_KEY_API_KEY: USER_API_KEY
          ENV_KEY_SECRET_KEY: secret123
```

will create a development.env file in tests/ directory which would contain

```bash
OUTPUT_PROJECT_NAME=dot-env
OUTPUT_USERNAME=admin
OUTPUT_DEBUG=true
OUTPUT_API_KEY=USER_API_KEY
OUTPUT_SECRET_KEY=secret123
```
