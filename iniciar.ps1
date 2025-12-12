# Script para iniciar o servidor de desenvolvimento Navacho
Write-Host "🚀 Iniciando servidor de desenvolvimento Navacho..." -ForegroundColor Green
Write-Host ""

# Navegar para o diretório do projeto
Set-Location $PSScriptRoot

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Iniciar o servidor
Write-Host "🔥 Iniciando Vite..." -ForegroundColor Cyan
Write-Host "📝 A URL será exibida abaixo. Aguarde alguns segundos..." -ForegroundColor Yellow
Write-Host ""

npm run dev

