@echo off
echo ============================================
echo    🏛️ Cờ Tướng Online - Building Project
echo ============================================
echo.

echo ✅ Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
    pause
    exit /b 1
)

echo ✅ Java found!
echo.

echo 🔨 Building project...
call mvnw.cmd clean package -DskipTests

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo 📦 JAR file created in target/ directory
    echo.
    echo 🚀 To run the application:
    echo    java -jar target/cotuong-online-1.0.0.jar
    echo.
    echo 🌐 Then open: http://localhost:8080
) else (
    echo.
    echo ❌ Build failed! Please check the error messages above.
)

echo.
pause
