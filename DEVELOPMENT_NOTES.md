# Növényfelismerő Gyakorló MVP - Fejlesztési Napló

Ez a dokumentum rögzít minden lépést, amit ezen a gépen végeztünk, hogy otthonról pontosan tudd folytatni.

## 1. Környezet beállítása (2026-04-22)
- **Node.js telepítése**: Sikeresen feltelepítve a `winget install OpenJS.NodeJS.LTS` paranccsal.
- **Node verzió**: v24.15.0
- **Git**: Előtelepítve a gépen (v2.39.2).

### PATH hiba elhárítása
A telepítés után a terminált újra kell indítani, hogy felismerje a `node` parancsot. Ha otthon is ebbe ütköznél, egy újraindítás vagy a VS Code bezárása/megnyitása megoldja.

## 2. Projekt Inicializálása (Kész)
- **Technológia**: Vite + React + TypeScript + Tailwind CSS v4.
- **Folyamat**: Mivel a mappa nem volt üres, egy ideiglenes mappát használtunk a generáláshoz, majd a fájlokat bemásoltuk a projekt gyökerébe.
- **Tailwind v4**: A legújabb v4 verziót használtuk, amely nem igényel külön technikai konfigurációs fájlokat a Vite plugin (@tailwindcss/vite) használata mellett.

## 3. GitHub Összekötés (Folyamatban)
- [ ] Üres repository létrehozása a GitHubon.
- [/] Git inicializálása helyben.
- [ ] `git remote add origin <URL>` futtatása.
- [ ] Első push elvégzése.

## 4. Specifikációk
- **Forrás**: `Park spec.txt` (v1.1) alapján dolgozunk.
- **Különleges kérés**: Csak magyar nevek a felületen, latin nevek a háttérben a képkereséshez.
- **Képforrás**: `loremflickr.com` dinamikus eléréssel.
