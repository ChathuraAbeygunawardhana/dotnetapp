@echo off
setlocal
title Stopping Dev Environment

echo.
echo  dotnetapp - Stopping Dev Environment
echo  ==========================================
echo.

:: ── Stop Docker backend container ───────────────────────────────────────────
echo  [1/2] Stopping backend container...
docker stop helloworld-local >nul 2>&1
if !errorlevel! equ 0 (
    echo   Container 'helloworld-local' stopped.
) else (
    echo   Container was not running.
)
echo.

:: ── Kill Next.js dev server (node process on port 3000) ─────────────────────
echo  [2/2] Stopping frontend (port 3000)...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo   Killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)
echo   Frontend stopped.
echo.

echo  ==========================================
echo   All services stopped.
echo  ==========================================
echo.
pause
