# Stable360 — mniejsza paczka do GitHub

## Wgranie plików

1. Rozpakuj ZIP na komputerze. Do GitHub przesyłaj jego zawartość.
2. W repozytorium wybierz **Add file → Upload files**.
3. Dodawaj po kilka plików naraz i zapisuj je przez **Commit changes**.
   Nie twórz podfolderu: wszystkie pliki mają trafić do głównego katalogu repozytorium.
4. Wgraj cały komplet: 19 plików. Największy ma 2 MB.

Pliki `site.bundle.001`–`site.bundle.014` to części strony.
Potrzebne są wszystkie części oraz `build.mjs`, `package.json`, `vercel.json`,
`README.md` i ukryty `.gitignore`.

Jeśli poprzednia paczka została już wgrana, potwierdź zastąpienie plików o tych
samych nazwach. Wgrywaj cały nowy komplet; nie mieszaj części obu wersji.

## Vercel

Połącz repozytorium z Vercel po dodaniu wszystkich plików.
Ustawienia są zapisane w `vercel.json`:

- Framework: **Other**
- Build Command: **node build.mjs**
- Output Directory: **public**
- Install Command: puste
- Root Directory: główny katalog repozytorium

Podczas budowania strona automatycznie odtworzy 371 plików w `public/`.
Nie są wymagane dodatkowe zależności ani klucze API.

## Co zmniejszono

Obrazy zapisano w WebP z zachowaniem rozdzielczości. Instrukcja PDF zawiera
wszystkie 118 stron, oryginalny tekst i obrazy w tych samych rozmiarach.
Zachowano film, wszystkie podstrony, artykuły, chat i osadzenie Instagrama.

## Opcjonalne uruchomienie lokalne

Uruchom `npm run build`, aby odtworzyć stronę w `public/`.
Nie przesyłaj wygenerowanego folderu `public/` przez formularz GitHub.
