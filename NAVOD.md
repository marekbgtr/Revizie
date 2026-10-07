# Revízie SPS – prenosná ukážka

Statická aplikácia pre PC aj mobil. Súbory v tomto balíku sú pripravené na GitHub Pages. Nepotrebuje backend, účet ani databázový server.

## Použitie

1. Otvor aplikáciu a zvoľ **Načítať Excel**.
2. Vyber pripravený `Revizie_AppSheet_zaklad_v01.xlsx` (najviac 20 MB).
3. Filtruj podľa strediska, kategórie a výhľadu 1–36 mesiacov.
4. Kliknutím na zariadenie otvor kartu. Uprav údaje alebo termín, prípadne pridaj revíziu do histórie.
5. Klikni **Exportovať Excel**. Stiahnutý súbor ulož na OneDrive ručne.

Údaje sú iba v pamäti aktuálnej stránky. Nie je tu automatická synchronizácia, úložisko pre viacerých používateľov ani trvalé ukladanie v prehliadači. Neexportované zmeny sa po obnovení/zatvorení stránky alebo jej ukončení mobilným systémom stratia. Export stiahne nový zošit; neprepisuje pôvodný súbor.

Ukážkové záznamy sú fiktívne. Údaje z importovaného zošita ani PDF aplikácia neposiela na server. Skripty a štýly sú pribalené; nepoužíva analytiku, externé fonty ani CDN.

## GitHub Pages

Do vybraného repozitára vlož **rozbalený obsah tohto ZIP balíka** (index.html musí byť v koreňovom priečinku zverejňovanej vetvy). V Settings → Pages nastav zdroj na príslušnú vetvu a koreňový priečinok. Súbor `.nojekyll` ponechaj. Cesty sú relatívne, takže aplikácia funguje aj na adrese s názvom repozitára.

Do repozitára nenahrávaj Excel s firemnými údajmi ani PDF. Nie sú potrebné na spustenie aplikácie. Otvárajú sa až v prehliadači konkrétneho používateľa.

## Podporovaný zošit

Povinné hárky: Zariadenia, PlanKontrol, Revizie, Strediska, DruhyKontrol. Kategórie, parametre a dokumenty sa načítajú, ak existujú. Podporované je pole KontrolaPodkladov aj staršie OverenieUdajov. Import zachová všetky hárky a Excel balík. Export mení zvolené bunky a rozširuje tabuľku Revizie pri novom zázname. Vstupný súbor musí používať štandardný dátumový systém 1900, nie 1904.

Pravidlá výhľadu sú v `core.js`, import/export v `excel.js` a ovládanie v `app.js`. Nevyžadované kontroly a vyradené zariadenia sú neaktívne. Neskontrolované podklady a neoverené termíny patria do prehľadu Na overenie. Intervaly sú prevzaté zo zošita; aplikácia ich neposudzuje podľa legislatívy. Neplatný výsledok revízie sa automaticky nemení na stav vyradeného zariadenia.

Dokumenty sa zobrazujú ako evidencia zo zošita. Lokálne PDF je možné otvoriť, ale nepripája sa automaticky k zariadeniu. OneDrive API a používateľské účty nie sú súčasťou tejto verzie.

## Závislosti

Pribalené JSZip a xml-js. Ich licencie sú v `vendor/`. Testy importu, exportu, referencií a dátumových hraníc sa spúšťajú cez `node tests.cjs` v prostredí s dostupnými balíkmi jszip a xml-js.
