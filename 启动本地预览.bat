@echo off
setlocal

pushd "%~dp0"
if errorlevel 1 (
  echo [ERROR] Cannot open the project directory.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found. Install Node.js LTS and run this file again.
  pause
  exit /b 1
)

where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] pnpm was not found. Install pnpm 9 or newer and run this file again.
  pause
  exit /b 1
)

if not exist "package.json" (
  echo [ERROR] package.json was not found in the project directory.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [ERROR] Dependencies are missing. Run pnpm install in this directory first.
  pause
  exit /b 1
)

if "%DEPLOY_RUN_PORT%"=="" set "DEPLOY_RUN_PORT=5000"

echo.
echo Building the current version...
call pnpm build
if errorlevel 1 (
  echo.
  echo [ERROR] Build failed. The preview server was not started.
  pause
  exit /b 1
)

echo.
echo Preview server: http://localhost:%DEPLOY_RUN_PORT%
echo Keep this window open while previewing. Close it to stop the server.
echo.
call pnpm exec next start --port %DEPLOY_RUN_PORT%

popd
endlocal
