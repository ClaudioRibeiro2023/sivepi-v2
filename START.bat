@echo off
title SIVEPI - Sistema de Vigilancia Epidemiologica
color 0A

echo ========================================
echo  SIVEPI v2.0
echo  Sistema Integrado de Vigilancia
echo  Epidemiologica
echo ========================================
echo.
echo Preparando ambiente...
echo.

REM Copiar CSV se nao existir no public
if not exist "public\01-Dados\banco_dados_aedes_montes_claros_normalizado.csv" (
    echo Copiando arquivo de dados...
    if not exist "public\01-Dados" mkdir "public\01-Dados"
    xcopy "01 - Dados\banco_dados_aedes_montes_claros_normalizado.csv" "public\01-Dados\" /Y >nul 2>&1
    echo Dados copiados!
    echo.
)

echo Iniciando servidor de desenvolvimento...
echo.
echo O navegador sera aberto automaticamente em:
echo http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

npm run dev

pause
