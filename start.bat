@echo off
echo ============================================
echo    🏛️ Cờ Tướng Online - Starting Server
echo ============================================
echo.

echo ✅ Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
    echo 📥 Download from: https://adoptium.net/
    pause
    exit /b 1
)

echo ✅ Java found!

echo 🔧 Setting up JAVA_HOME...
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
if not exist "%JAVA_HOME%" (
    echo ⚠️ Trying alternative Java path...
    set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.8"
)
if not exist "%JAVA_HOME%" (
    echo ⚠️ Using JAVA_HOME from PATH...
    for /f "tokens=*" %%i in ('where java') do (
        set "JAVA_PATH=%%i"
        set "JAVA_HOME=!JAVA_PATH:\bin\java.exe=!"
    )
)
echo ✅ JAVA_HOME set to: %JAVA_HOME%
echo.

echo 🚀 Starting Cờ Tướng Online server...
echo ⏳ This may take a moment on first run...
echo.

call mvnw.cmd spring-boot:run

echo.
echo 👋 Server stopped. Press any key to exit...
pause >nul
