# Cờ Tướng Online - PowerShell Start Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    🏛️ Cờ Tướng Online - Starting Server" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Checking Java installation..." -ForegroundColor Green
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java found!" -ForegroundColor Green
    Write-Host "$javaVersion" -ForegroundColor Gray
} catch {
    Write-Host "❌ Java not found! Please install Java 17 or higher." -ForegroundColor Red
    Write-Host "📥 Download from: https://adoptium.net/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up JAVA_HOME..." -ForegroundColor Blue

# Try to find Java installation
$javaPaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.8",
    "C:\Program Files\OpenJDK\jdk-17",
    "C:\Program Files\Eclipse Adoptium\jdk-17"
)

$javaHome = $null
foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        $javaHome = $path
        break
    }
}

if (-not $javaHome) {
    # Try to extract from java command path
    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCmd) {
        $javaHome = Split-Path (Split-Path $javaCmd.Source -Parent) -Parent
    }
}

if ($javaHome) {
    $env:JAVA_HOME = $javaHome
    Write-Host "✅ JAVA_HOME set to: $javaHome" -ForegroundColor Green
} else {
    Write-Host "⚠️ Could not find JAVA_HOME, using system default" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Starting Cờ Tướng Online server..." -ForegroundColor Cyan
Write-Host "⏳ This may take a moment on first run..." -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 After startup, open your browser and go to:" -ForegroundColor Green
Write-Host "   http://localhost:8080" -ForegroundColor Yellow
Write-Host ""

# Run the application
try {
    & ".\mvnw.cmd" spring-boot:run
} catch {
    Write-Host ""
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "👋 Server stopped. Press any key to exit..." -ForegroundColor Gray
Read-Host
