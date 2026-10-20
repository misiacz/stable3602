# Stable360 — aktualizacja Vercel

Wersja: 2026-10-20-vercel-fix-1

To paczka kodu źródłowego. Vercel sam instaluje zależności i buduje stronę.

## Wgranie aktualizacji

1. Rozpakuj ZIP na komputerze.
2. W repozytorium `misiacz/stable3602`, na gałęzi `main`, wgraj zawartość paczki do głównego katalogu. Pliki `package.json`, `package-lock.json` i `vercel.json` muszą leżeć bezpośrednio obok folderów `app`, `public` i `scripts`. Nie wgrywaj samego ZIP-a ani dodatkowego folderu otaczającego zawartość.
3. Zapisz zmiany (Commit changes). W projekcie Vercel `stable3602` powinno rozpocząć się nowe wdrożenie. Zaczekaj na status `Ready`.
4. Otwórz `https://website.stable360.pl/stable360-version.json`. Aktualna paczka zwraca `"version":"2026-10-20-vercel-fix-1"`. Jeśli widzisz inną treść lub błąd 404, domena nie obsługuje jeszcze tej paczki.

Jeśli Vercel nie rozpocznie kompilacji, sprawdź projekt `stable3602`: repozytorium `misiacz/stable3602`, Production Branch `main`, Root Directory pusty lub `.`. Ustawienia kompilacji są zapisane w `vercel.json`: Framework `Next.js`, Build Command `npm run build`, Output Directory `out`, Install Command `npm ci --ignore-scripts --no-audit --no-fund`, Node.js `24.x`.

Nie kopiuj plików z wcześniejszych eksportów do `app`. Skrypt uruchamiany przed kompilacją usuwa znane stare pliki HTML i folder `public/_next`, które mogły zostać po wcześniejszym eksporcie; zachowuje zdjęcia i wideo.

## Sprawdzenie lokalne

W Node.js 24: `npm ci --ignore-scripts --no-audit --no-fund`, następnie `npm run build`. Gotowa statyczna strona powstaje w `out`.

Paczka przeszła kompilację Next.js i sprawdzanie TypeScript. Zawiera aktualne menu mobilne, poprawione proporcje zdjęcia, komunikat cookies, opisy zespołu i interaktywne ekrany ról. Ekrany demonstracyjne zapisują dane lokalnie w przeglądarce.
