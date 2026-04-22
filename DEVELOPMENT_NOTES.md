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

## 4. Megvalósított Funkciók (MVP v1.1)
- **Adatbázis**: 50 növény magyar és latin névvel, kategóriákba sorolva (`src/data/plants.json`).
- **Dinamikus Képek**: A `loremflickr` API segítségével a latin nevek alapján töltődnek be a fotók.
- **Kvíz Logika**: 
  - Véletlenszerű kérdéssorrend minden indításnál.
  - Egyedi (átfedés mentes) válaszlehetőségek generálása.
  - Azonnali vizuális visszajelzés (Helyes/Helytelen).
  - Százalékos haladásjelző és pontszám követés.
- **Design**: Prémium botanikai esztétika, üveghatású (glassmorphism) kártyák és sima animációk.

## 5. Teendők az otthoni gépen
1. **Repository letöltése**: 
   `git clone https://github.com/Rimi12/novenyfelismero-app.git`
2. **Függőségek telepítése**: 
   `npm install`
3. **Indítás**: 
   `npm run dev`
4. **Fejlesztés folytatása**: Bármilyen kódbeli változtatást elvégzel, ne felejtsd el a `git push` parancsot a végén!
