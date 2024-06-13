@echo off
REM Check if argument is "database"
if "%1"=="database" (
    REM Run Node.js command for database
    node --env-file=.env test/database/connector.test.mjs
) else if "%1"=="api" (
    REM Run Node.js command for other argument
) else (
    REM Handle invalid argument
    echo Invalid argument. Please provide either "database" or "api".
)
