@echo off
setlocal enabledelayedexpansion
title Local Dev - dotnetapp

:: ── Resolve repo root ───────────────────────────────────────────────────────
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "CONTAINER=helloworld-local"

echo.
echo  dotnetapp Local Dev
echo  ==========================================
echo   Backend  ^-^> http://localhost:3001  (.NET via Docker)
echo   Frontend ^-^> http://localhost:3000  (Next.js)
echo  ==========================================
echo.

:: ── Check Docker is running ─────────────────────────────────────────────────
docker info >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

:: ── Detect if backend source changed (compare file dates+sizes) ─────────────
set "HASH_FILE=%TEMP%\dotnetapp_backend_hash.txt"
set "HASH_NEW="
for %%f in ("%BACKEND%\Program.cs" "%BACKEND%\HelloWorld.csproj" "%BACKEND%\Dockerfile.vercel") do (
    set "HASH_NEW=!HASH_NEW!%%~tf|%%~zf;"
)

set "HASH_OLD=none"
if exist "%HASH_FILE%" set /p HASH_OLD=<"%HASH_FILE%"

set "NEEDS_BUILD=0"
if not "!HASH_NEW!"=="!HASH_OLD!" set "NEEDS_BUILD=1"

:: ── Build only when source changed ──────────────────────────────────────────
if "!NEEDS_BUILD!"=="1" (
    echo  [1/3] Source changed - building Docker image...
    docker build -f "%BACKEND%\Dockerfile.vercel" -t helloworld-vercel "%BACKEND%"
    if !errorlevel! neq 0 (
        echo  [ERROR] Docker build failed.
        pause
        exit /b 1
    )
    echo !HASH_NEW!> "%HASH_FILE%"
    :: Remove the old named container so it gets recreated with the new image
    docker rm -f %CONTAINER% >nul 2>&1
    echo  [1/3] Build done.
) else (
    echo  [1/3] Source unchanged - skipping build.
)
echo.

:: ── Start backend ───────────────────────────────────────────────────────────
echo  [2/3] Starting backend...

:: Stop it if already running (so we can re-attach cleanly)
docker stop %CONTAINER% >nul 2>&1

:: Create the named container if it doesn't exist yet
set "CONTAINER_ID="
for /f %%i in ('docker ps -a -q --filter "name=%CONTAINER%"') do set "CONTAINER_ID=%%i"
if "!CONTAINER_ID!"=="" (
    echo   Creating container '%CONTAINER%'...
    docker create --name %CONTAINER% -p 3001:80 -e PORT=80 helloworld-vercel >nul
)

:: Start it in a new window (-a attaches stdout/stderr so logs are visible)
start "Backend - .NET API - localhost:3001" cmd /k "docker start -a %CONTAINER%"
timeout /t 4 /nobreak >nul
echo  [2/3] Backend started.
echo.

:: ── Write and launch frontend helper ────────────────────────────────────────
echo  [3/3] Starting frontend...
set "HELPER=%TEMP%\dotnetapp_frontend_dev.bat"
echo @echo off                   > "%HELPER%"
echo title Frontend - Next.js   >> "%HELPER%"
echo pushd "%FRONTEND%"         >> "%HELPER%"
echo npm run dev                >> "%HELPER%"

start "Frontend - Next.js - localhost:3000" cmd /k "%HELPER%"
echo  [3/3] Frontend starting...
echo.

:: ── Summary ─────────────────────────────────────────────────────────────────
echo  ==========================================
echo   Dev environment is running!
echo.
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:3000
echo.
echo   Close the spawned windows to stop servers.
echo   Container '%CONTAINER%' persists between runs.
echo  ==========================================
echo.
pause
