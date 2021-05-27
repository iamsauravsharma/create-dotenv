# Create dotenv action

This action creates dotenv file

## Inputs

### `env-prefix`

**Required** The prefix for environmental variable which should be stored in .env file. If you need to store all environmental varaible then you can pass `''` as env-prefix which will store all environmental variable in .env file

### `file-name`
Location of dot env file. Default is `.env`

### `directory`
Dot env file directory path default is `.`

## Outputs

### `env-file`
Absolute location of env file created by action

## Example usage

```yaml
name: Create env file

on: [ push ]

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
      - uses: actions/checkout@v2
      
      - uses: iamsauravsharma/create-dotenv@v1.1.0
        with:
          env-prefix: 'ENV_KEY_' # Required
          file-name: 'development.env' # Optional (default : .env)
          directory: 'tests/' # Optional (default: .)
        env: # env available for only this steps
          IS_SERVER: true
          ENV_KEY_USERNAME: admin
          ENV_KEY_API_KEY: USER_API_KEY
          ENV_KEY_SECRET_KEY: secret123
```
will create a development.env file in tests/ directory would contain
```sh
PROJECT_NAME=dot-env
USERNAME=admin
DEBUG=true
API_KEY=USER_API_KEY
SECRET_KEY=secret123
```
