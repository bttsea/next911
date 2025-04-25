@echo off
setlocal
cd /d %~dp0

echo Removing old node_modules\next if exists...
rd /s /q node_modules\next

echo Creating symlink from node_modules\next to ..\..\next
mklink /D node_modules\next ..\..\next

echo Done.
pause
