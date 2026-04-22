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

## 3. GitHub Összekötés (Kész)
- [x] Üres repository létrehozása a GitHubon.
- [x] Git inicializálása helyben.
- [x] `git remote add origin https://github.com/Rimi12/novenyfelismero-app.git`
- [x] Első push elvégzése.

## 4. Megvalósított Funkciók (MVP v1.4 - Képhitelességi Frissítés)
- **Tudományosan Hiteles Képek**: A `loremflickr` (véletlenszerű képek) véglegesen eltávolításra került.
- **Többszintű Keresés**: A program mostantól 3 szinten keres hiteles fotót: EN Wikipedia -> HU Wikipedia -> Wikimedia Commons tárhely.
- **Esztétikus Fallback**: Ha egyik forrás sem ad találatot, egy professzionális helyőrző grafika jelenik meg a növény nevével, elkerülve a téves információkat.
- **Forrásmegjelölés**: A képek sarkában diszkréten megjelenik a forrás (Wikimedia / Wikipedia).

## 5. Teendők az otthoni gépen
1. **Szinkronizálás**: `git pull origin main` (hogy az új adatbázis és logika letöltődjön).
2. **Függőségek telepítése**: 
   `npm install`
3. **Indítás**: 
   `npm run dev`
4. **Fejlesztés folytatása**: Bármilyen kódbeli változtatást elvégzel, ne felejtsd el a `git push` parancsot a végén!
