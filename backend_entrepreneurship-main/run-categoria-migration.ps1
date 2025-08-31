Write-Host "========================================" -ForegroundColor Green
Write-Host "Ejecutando migracion de CategoriaActivoFijo" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "2. Ejecutando migracion..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host ""
Write-Host "3. Ejecutando seed de categorias..." -ForegroundColor Yellow
node prisma/seed-categorias-activo-fijo.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Migracion completada exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host "Presiona Enter para continuar"
