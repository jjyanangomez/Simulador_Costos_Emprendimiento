Write-Host "Ejecutando migración de Prisma..." -ForegroundColor Green
Write-Host ""

Write-Host "Generando cliente de Prisma..." -ForegroundColor Yellow
try {
    & npx prisma generate
    Write-Host "Cliente de Prisma generado exitosamente!" -ForegroundColor Green
} catch {
    Write-Host "Error al generar cliente de Prisma: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Migración completada!" -ForegroundColor Green
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
