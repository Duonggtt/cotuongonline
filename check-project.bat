@echo off
echo ============================================
echo    ✅ Kiểm tra Project trước Deploy
echo ============================================
echo.

echo 🔍 Đang kiểm tra project structure...
echo.

REM Check essential files
set "error_count=0"

echo [1/10] Checking pom.xml...
if exist "pom.xml" (
    echo    ✅ pom.xml found
) else (
    echo    ❌ pom.xml missing
    set /a error_count+=1
)

echo [2/10] Checking main application class...
if exist "src\main\java\com\cotuong\CoTuongOnlineApplication.java" (
    echo    ✅ Main application class found
) else (
    echo    ❌ Main application class missing
    set /a error_count+=1
)

echo [3/10] Checking templates...
if exist "src\main\resources\templates\index.html" (
    echo    ✅ index.html template found
) else (
    echo    ❌ index.html template missing
    set /a error_count+=1
)

if exist "src\main\resources\templates\game.html" (
    echo    ✅ game.html template found
) else (
    echo    ❌ game.html template missing
    set /a error_count+=1
)

echo [4/10] Checking static resources...
if exist "src\main\resources\static\css\main.css" (
    echo    ✅ CSS files found
) else (
    echo    ❌ CSS files missing
    set /a error_count+=1
)

if exist "src\main\resources\static\js\game.js" (
    echo    ✅ JavaScript files found
) else (
    echo    ❌ JavaScript files missing
    set /a error_count+=1
)

echo [5/10] Checking configuration files...
if exist "src\main\resources\application.properties" (
    echo    ✅ application.properties found
) else (
    echo    ❌ application.properties missing
    set /a error_count+=1
)

if exist "src\main\resources\application-prod.properties" (
    echo    ✅ Production config found
) else (
    echo    ❌ Production config missing
    set /a error_count+=1
)

echo [6/10] Checking Vercel config...
if exist "vercel.json" (
    echo    ✅ vercel.json found
) else (
    echo    ❌ vercel.json missing
    set /a error_count+=1
)

echo [7/10] Checking Maven wrapper...
if exist "mvnw.cmd" (
    echo    ✅ Maven wrapper found
) else (
    echo    ❌ Maven wrapper missing
    set /a error_count+=1
)

echo [8/10] Checking Java version...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Java found
    java -version 2>&1 | findstr "17" >nul
    if %errorlevel% equ 0 (
        echo    ✅ Java 17 detected
    ) else (
        echo    ⚠️  Java version might not be 17
    )
) else (
    echo    ❌ Java not found
    set /a error_count+=1
)

echo [9/10] Testing compilation...
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
call mvnw.cmd clean compile -q >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Code compiles successfully
) else (
    echo    ❌ Compilation errors detected
    set /a error_count+=1
)

echo [10/10] Checking Git repository...
git status >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Git repository initialized
) else (
    echo    ❌ Not a Git repository
    set /a error_count+=1
)

echo.
echo ============================================
echo              📊 KIỂM TRA TỔNG KẾT
echo ============================================

if %error_count% equ 0 (
    echo ✅ TẤT CẢ ĐỀU OK! Project sẵn sàng deploy!
    echo.
    echo 🚀 BƯỚC TIẾP THEO:
    echo    1. Chạy: push-to-github.bat
    echo    2. Hoặc chạy manual:
    echo       git add .
    echo       git commit -m "Ready for deploy"  
    echo       git push origin main
    echo    3. Deploy lên Vercel
    echo.
    echo 📖 Xem DEPLOY_GUIDE.md để biết chi tiết
) else (
    echo ❌ CÓ %error_count% LỖI CẦN SỬA!
    echo.
    echo 🔧 HƯỚNG DẪN SỬA LỖI:
    echo    1. Kiểm tra các file bị thiếu ở trên
    echo    2. Đảm bảo Java 17 đã cài đặt
    echo    3. Chạy: mvnw.cmd clean compile
    echo    4. Chạy lại script này
)

echo.
echo 📁 PROJECT SIZE:
for /f %%A in ('dir /s /-c ^| find "bytes"') do echo    %%A

echo.
echo 🌐 Sau khi deploy, test các tính năng:
echo    ✓ Tạo phòng
echo    ✓ Join phòng  
echo    ✓ Chơi cờ
echo    ✓ Chat
echo    ✓ WebSocket real-time

echo.
pause
