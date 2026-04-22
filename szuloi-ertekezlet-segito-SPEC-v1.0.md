# Szülői értekezlet segítő — fejlesztői specifikáció v1.0

## 1. Áttekintés

A **Szülői értekezlet segítő** egy egyoldalas webalkalmazás, amely támogatja egy szülői értekezlet:
- előkészítését,
- lebonyolítását,
- lezárását.

Az alkalmazás célja, hogy strukturált, gyorsan használható munkafolyamatot adjon a felhasználónak az esemény adatainak rögzítéséhez, a témák nyomon követéséhez, jegyzeteléshez, opcionális szavazások rögzítéséhez, valamint az értesítő és záró összefoglaló szöveg előállításához.

---

## 2. Célfelhasználó

Elsődleges felhasználó:
- tanár / osztályfőnök / pedagógus

Felhasználói igények:
- gyors adatbevitel,
- egyértelmű, lépésről lépésre követhető felület,
- másolható és letölthető szöveges kimenetek,
- helyi adatmegőrzés ugyanazon a gépen ugyanabban a böngészőben.

---

## 3. Terjedelem és scope

### A specifikációba tartozik
- alapadatok rögzítése,
- témák kezelése,
- értesítő szöveg előállítása,
- értekezlet közbeni témakezelés,
- jegyzetelés,
- opcionális szavazásrögzítés,
- záró összefoglaló előállítása,
- helyi mentés,
- másolás és letöltés szövegfájlba.

### A specifikációba nem tartozik
- tényleges email-küldés,
- felhasználókezelés,
- adatbázis,
- többfelhasználós működés,
- online szavazás,
- PDF export,
- naptárintegráció,
- külső AI API használata.

---

## 4. Funkcionális követelmények

## 4.1 Alapadatok

A felhasználó az alábbi adatokat adhatja meg az értekezlet előkészítése során:
- dátum
- osztály neve
- helyszín (opcionális)
- bevezető megjegyzés (opcionális)

### Követelmények
- A dátum kötelező mező.
- Az osztály mező kötelező mező.

### Megjegyzés
- A jelenlévő szülők száma **nem** itt, hanem az értekezlet nézetben (4.4) kerül rögzítésre, mivel az értekezlet előtt még nem ismert adat. Lásd 4.4.

---

## 4.2 Témák kezelése

A felhasználó témákat adhat hozzá az értekezlethez.

Minden téma mezői:
- cím (kötelező)
- rövid leírás (opcionális)
- a leírás megjelenjen-e az értesítő szövegében (bool, opcionális kapcsoló)
- státusz
- jegyzet
- szavazásadatok

### Elvárt műveletek
- téma hozzáadása
- téma szerkesztése
- téma törlése
- témák sorrendjének megőrzése és megváltoztatása (fel/le mozgatás)

### Téma státuszok
Minden téma pontosan egy státusszal rendelkezzen:
- **megbeszélve**
- **kimaradt**

Alapértelmezett státusz új téma létrehozásakor: **megbeszélve**.

### A leírás megjelenítése az értesítőben
- Minden témához tartozik egy külön kapcsoló, amely azt szabályozza, hogy a téma rövid leírása megjelenjen-e a generált értesítő szövegében.
- A kapcsoló alapértelmezett értéke: **kikapcsolt**. Az értesítő szülőknek szól, így a belső, tanárnak szóló jegyzet jellegű leírás szándékos döntés nélkül ne kerüljön ki.
- A kapcsoló csak akkor legyen értelmezhető (aktív), ha a témához tartozik nem üres leírás.

---

## 4.3 Értesítő szöveg

Az alkalmazás a megadott alapadatok és témák alapján készítsen másolható, letölthető értesítő szöveget.

### Tartalmi követelmények
Az értesítő tartalmazza:
- megszólítást,
- az esemény megnevezését,
- a dátumot,
- a helyszínt, ha meg van adva,
- a bevezető megjegyzést, ha meg van adva,
- rövid utalást a témákra (témák címeivel; a leírás csak akkor jelenik meg, ha a témánál a „leírás az értesítőben" kapcsoló be van kapcsolva),
- udvarias zárást.

### Működési követelmények
- A szöveg sablon- vagy szabályalapú logikával épüljön fel.
- Ne használjon külső modellt vagy API-t.
- A szöveg legyen természetes hangvételű és azonnal másolható.
- A szöveg UTF-8 kódolású, plaintext formátumú legyen (lásd 8.3).

### Műveletek
- vágólapra másolás
- letöltés `.txt` fájlként (UTF-8)

---

## 4.4 Értekezlet nézet

Az alkalmazás biztosítson olyan nézetet, ahol a felhasználó végig tud haladni a rögzített témákon.

A nézet tetején rögzíthető:
- **jelenlévő szülők száma.** Ezt érdemes az értekezlet elején beállítani, mivel ez az érték szolgál a szavazások validációs felső korlátjaként.

Minden témánál legyen elérhető:
- státusz kiválasztása,
- rövid jegyzet mező,
- szavazás bekapcsolása / kikapcsolása.

### Jelenlévő szülők száma — validáció
- Egész szám legyen.
- Nem lehet negatív.
- Hibás érték esetén egyértelmű, emberi nyelvű hibaüzenet jelenjen meg.

### Ha egy témához szavazás tartozik
Rögzíthető mezők:
- a szavazás tárgya,
- az eredmény rövid leírása,
- támogatók száma (opcionális numerikus mező).

### Szavazás — validáció
- A támogatók száma nem lehet negatív.
- A támogatók száma nem lehet nagyobb a jelenlévő szülők számánál.
- Hibás érték esetén egyértelmű, emberi nyelvű hibaüzenet jelenjen meg.

---

## 4.5 Összefoglaló

Az alkalmazás az addig rögzített adatokból készítsen strukturált záró összefoglalót.

### Az összefoglaló tartalmazza
- alapadatok,
- jelenlévő szülők száma (csak ha meg van adva, azaz nagyobb mint 0),
- megbeszélt témák és a hozzájuk tartozó jegyzetek,
- rögzített szavazások és eredmények,
- kimaradt témák,
- rövid záró szakasz.

### Hangnem
- tárgyilagos,
- rendezett,
- közérthető,
- nem túl hivataloskodó.

### Műveletek
- vágólapra másolás
- letöltés `.txt` fájlként (UTF-8)

---

## 4.6 Helyi mentés

Az alkalmazás mentse a folyamatban lévő adatokat helyben a böngészőben.

### Követelmények
- Az adatok frissítés után visszatölthetők legyenek.
- A mentés történhet automatikusan.
- Legyen lehetőség új értekezlet indítására.
- Új értekezlet indításakor az alkalmazás tiszta állapotra álljon vissza, megerősítés után.

---

## 5. Képernyők és felületi szerkezet

Az alkalmazás legalább az alábbi fő szekciókat tartalmazza:

### 5.1 Előkészítés
Tartalom:
- alapadat-űrlap (dátum, osztály, helyszín, bevezető megjegyzés)
- témák kezelése

### 5.2 Értesítő
Tartalom:
- generált értesítő szöveg
- másolás gomb
- letöltés gomb

### 5.3 Értekezlet
Tartalom:
- jelenlévő szülők számának beviteli mezője
- témalista vagy témakártyák
- státuszválasztás
- jegyzetelés
- opcionális szavazási blokk

### 5.4 Összefoglaló
Tartalom:
- generált összefoglaló
- másolás gomb
- letöltés gomb

### Navigációs követelmény
A felületből egyértelműen látszódjon, hogy a felhasználó a folyamat melyik szakaszában van. A felhasználónak biztosítani kell a szabad mozgást a szekciók között (oda-vissza léptetés).

---

## 6. Nem funkcionális követelmények

### 6.1 Nyelv
- A felület magyar nyelvű legyen.
- A generált szövegek magyar nyelvűek legyenek.

### 6.2 Használhatóság
- A felület legyen letisztult, nyugodt és áttekinthető.
- Elsősorban asztali használatra optimalizált, de mobilon is használható legyen.
- A fő műveletek kevés kattintással elérhetők legyenek.
- A stílus tárgyilagos, adminisztratív jellegű — nem demó, nem látványprojekt.

### 6.3 Hibatűrés
- Az inputhibákhoz közvetlen, jól érthető visszajelzés tartozzon.
- A hibák ne törjék meg az egész munkafolyamatot.

### 6.4 Teljesítmény
- Az alkalmazás gyorsan reagáljon.
- A helyi adatmennyiség legyen kicsi és kezelhető.

---

## 7. Adatmodell

Ajánlott logikai adatmodell:

```ts
type TopicStatus = "megbeszélve" | "kimaradt";

type VoteData = {
  enabled: boolean;
  subject: string;
  resultText: string;
  supporters?: number;
};

type MeetingTopic = {
  id: string;
  title: string;
  description?: string;
  includeDescriptionInNotice: boolean;
  status: TopicStatus;
  notes: string;
  vote: VoteData;
};

type MeetingData = {
  date: string;
  className: string;
  location?: string;
  attendeeCount: number;
  introNote?: string;
  topics: MeetingTopic[];
};
```

### Megjegyzések az adatmodellhez
- A `className` változónév belső technikai név; a felületen az „Osztály" címke jelenik meg.
- Az `attendeeCount` mezőt az értekezlet nézetben (4.4) szerkeszti a felhasználó, nem az előkészítésben.
- Az `includeDescriptionInNotice` alapértelmezett értéke `false`.

---

## 8. Szövegépítési szabályok

### 8.1 Értesítő
A generált értesítő épüljön előre definiált szerkezeti elemekből és feltételekből.

Ajánlott szerkezet:
1. megszólítás
2. esemény megnevezése
3. dátum
4. helyszín, ha van
5. bevezető megjegyzés, ha van
6. témák rövid említése (címek listája; témánként opcionálisan a leírás is, ha a téma-szintű kapcsoló engedélyezi)
7. zárás

### 8.2 Összefoglaló
A generált összefoglaló a rögzített adatokból épüljön fel.

Ajánlott szerkezet:
1. alapadatok
2. jelenléti adatok (csak ha meg van adva)
3. megbeszélt témák és jegyzetek
4. szavazások és eredmények
5. kimaradt témák
6. záró összegzés

### 8.3 Plaintext formátum
A generált szövegek plaintext (UTF-8) fájlként letölthetők. A formátum követelményei:

- Ne használjon Markdown-specifikus jelöléseket (pl. `#`, `**`, `*...*`), amelyek plaintext nézőben zajosak lennének.
- A főcím és a szekciócímek emelkedjenek ki valamilyen egyszerű, plaintext-barát módon (pl. setext-stílusú aláhúzás `===` és `---` karakterekkel). A pontos stílust a tervező választhatja meg, a lényeg, hogy a szöveg egy szövegszerkesztőben is olvashatóan tagolt legyen.
- A listaelemek egyszerű ASCII kötőjellel (`-`) kezdődjenek.
- Az üres sorok biztosítsák a szekciók közötti elkülönülést; egymás után több mint két üres sor ne keletkezzen.

---

## 9. Fájlnevek

A letöltött fájlok nevének formátuma:

- Értesítő: `szuloi-ertekezlet-ertesito-{osztaly}-{datum}.txt`
- Összefoglaló: `szuloi-ertekezlet-osszefoglalo-{osztaly}-{datum}.txt`

Az `{osztaly}` az osztály nevéből származtatott, ékezetmentes, URL-barát forma (csak kisbetű, szám és kötőjel). A `{datum}` ISO 8601 formátumú (`YYYY-MM-DD`). Ha valamelyik érték hiányzik, helyette értelmes helyettesítő szöveg kerüljön (pl. `datum-nelkul`).

---

## 10. Kizárások és korlátozások

Az alkalmazás jelen verziója nem tartalmaz:
- valódi levelezési integrációt,
- külső AI szolgáltatást,
- szerveroldali tárolást,
- felhasználói fiókokat,
- jogosultságkezelést,
- PDF-generálást,
- valós idejű közös használatot.

---

## 11. Elfogadási kritériumok

Az implementáció akkor tekinthető elfogadhatónak, ha:
1. az alapadatok rögzíthetők az előkészítés nézetben (dátum és osztály kötelezően),
2. a témák hozzáadhatók, szerkeszthetők, törölhetők, és a sorrendjük változtatható,
3. témánként beállítható, hogy a leírás megjelenjen-e az értesítőben,
4. a jelenlévő szülők száma az értekezlet nézetben rögzíthető,
5. a rendszer értesítő szöveget állít elő a megadott szerkezettel és a (3) szerinti feltételes leírásokkal,
6. a témák státusza (megbeszélve / kimaradt) és jegyzetei rögzíthetők,
7. a szavazás opcionálisan rögzíthető a validációs szabályokkal,
8. a rendszer összefoglalót készít a megadott szerkezettel,
9. a generált szövegek másolhatók és letölthetők `.txt` fájlként UTF-8 kódolással a 9. pont szerinti fájlnevekkel,
10. az adatok frissítés után helyben visszatölthetők,
11. az alkalmazás nem igényel backendet vagy külső szolgáltatást.
