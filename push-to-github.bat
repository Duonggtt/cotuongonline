@echo off
echo ============================================
echo    📤 Push Cờ Tướng Online lên GitHub
echo ============================================
echo.

echo 🔍 Kiểm tra Git status...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Thư mục này chưa phải Git repository!
    echo 💡 Chạy: git init
    pause
    exit /b 1
)

echo ✅ Git repository detected!
echo.

echo 📋 Nhập thông tin GitHub repository:
set /p GITHUB_USERNAME="👤 GitHub username của bạn: "
set /p REPO_NAME="📁 Tên repository (mặc định: cotuong-online): "

if "%REPO_NAME%"=="" set REPO_NAME=cotuong-online

echo.
echo 🔗 Repository URL: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.

echo ⚠️  Đảm bảo bạn đã tạo repository trên GitHub:
echo    1. Vào https://github.com/new
echo    2. Tên: %REPO_NAME%
echo    3. Public repository
echo    4. KHÔNG tích "Add a README file"
echo    5. Create repository
echo.

set /p CONFIRM="✅ Đã tạo repository chưa? (y/n): "
if /i "%CONFIRM%" neq "y" (
    echo 🚪 Hãy tạo repository trước rồi chạy lại script này.
    pause
    exit /b 0
)

echo.
echo 🚀 Đang push code lên GitHub...

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo 🔄 Remote origin đã tồn tại, đang cập nhật...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
) else (
    echo ➕ Thêm remote origin...
    git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

echo 📊 Checking for changes...
git add .
git diff --staged --quiet
if %errorlevel% neq 0 (
    echo 💾 Có thay đổi mới, đang commit...
    git commit -m "🚀 Deploy ready: Update code for production deployment"
)

echo 📤 Pushing to main branch...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ THÀNH CÔNG! Code đã được push lên GitHub!
    echo.
    echo 🌐 Repository URL: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
    echo.
    echo 🚀 BƯỚC TIẾP THEO - Deploy lên Vercel:
    echo    1. Vào https://vercel.com
    echo    2. Login với GitHub
    echo    3. New Project ^> Import từ GitHub
    echo    4. Chọn repository: %REPO_NAME%
    echo    5. Framework: Other
    echo    6. Build Command: ./mvnw clean package -DskipTests
    echo    7. Deploy!
    echo.
    echo 📖 Chi tiết: Xem file DEPLOY_GUIDE.md
) else (
    echo.
    echo ❌ LỖI khi push! Có thể:
    echo    1. Repository chưa được tạo
    echo    2. Sai username/repository name
    echo    3. Cần authentication
    echo.
    echo 💡 Thử:
    echo    git remote -v
    echo    git push origin main
)

echo.
pause
