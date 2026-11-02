# Avvia Mailpit
Start-Process -FilePath "C:\WINDOWS\system32\mailpit\mailpit.exe" -WindowStyle Minimized

# Avvia Laravel
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\rober\Desktop\DevStuff\client-flow'; php artisan serve" -WindowStyle Normal

# Avvia React
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\rober\Desktop\DevStuff\client-flow\frontend'; npm run dev" -WindowStyle Normal

Write-Host "ClientFlow avviato!" -ForegroundColor Green