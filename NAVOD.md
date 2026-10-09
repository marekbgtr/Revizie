# Revízie SPS – pracovná evidencia v1.3

Aplikácia sa spustí bez dát. Vždy načítaj posledný exportovaný XLSX cez Načítať Excel.

## Spoločná revízna správa

1. V Zariadeniach nastav filtre (stredisko, kategória, hľadané umiestnenie).
2. Označ zariadenia alebo vyber všetky vo filtri. Výber platí cez všetky strany; upozornenie zobrazuje aj počet vybraných mimo filtra.
3. Zvoľ Priradiť dokument alebo Zapísať spoločnú revíziu.
4. Zadaj nový dokument alebo vyber existujúci. Pri novom zadaj názov, číslo správy a odkaz na OneDrive alebo cestu k PDF.
5. Pri revízii vyplň spoločné údaje, každému zariadeniu vyber jeho kontrolu a over navrhnutý nasledujúci termín. Výsledok je spoločný, rozdielne výsledky spracuj oddelene.
6. Ulož a exportuj Excel. Pri ďalšej práci načítaj tento export.

Dokument je uložený raz v Dokumenty. Väzby sú v DokumentZariadenia a DokumentRevizie. Revízia vznikne pre každý vybraný plán zvlášť. Rovnaký deň pre rovnaký plán sa pri hromadnom zápise odmietne ako možná duplicita. Starší historický zápis neprepíše aktuálny plán. Stav fyzickej kontroly podkladov sa nemení automaticky.

PDF sa nekopíruje ani nevkladá do XLSX. Ulož ho do svojho úložiska; aplikácia eviduje jeho cestu/odkaz. Webový odkaz sa dá otvoriť v karte dokumentu, lokálne PDF cez výber súboru.

Údaje sú iba v pamäti stránky. Neexportované zmeny sa po obnovení alebo zatvorení stratia, aj keď mobilný systém ukončí stránku na pozadí. Zálohovanie ani automatická synchronizácia zatiaľ nie sú zapojené. Po exporte over, že prehliadač súbor skutočne stiahol, a ulož ho na OneDrive.

## GitHub Pages a telefón

Rozbaľ celý balík Revizie_SPS_PWA_v1.3.zip. Všetky jeho súbory nahraj vedľa seba do priečinka, z ktorého publikuješ GitHub Pages; index.html nahraď. Samotný ZIP nenahrávaj. Potrebné sú index.html, sw.js, manifest.webmanifest, icon-192.png, icon-512.png a apple-touch-icon.png. Tentoraz nestačí vymeniť iba index.html. V päte musí byť v1.3.

Android / Chrome: otvor svoju webovú adresu online, potom menu ⋮ → Pridať na plochu → Inštalovať. Alebo použi tlačidlo Nainštalovať aplikáciu, keď ho Chrome ponúkne. iPhone / Safari: Zdieľať → Pridať na plochu (Otvoriť ako webovú aplikáciu, ak sa ponúkne).

Po hlásení, že je offline režim pripravený, sa samotná aplikácia otvorí aj bez internetu. XLSX a PDF musia byť uložené v telefóne; odkazy na OneDrive potrebujú internet. Vymazanie údajov prehliadača môže odstrániť offline kópiu, vtedy otvor aplikáciu znovu online.

Inštalácia NEUKLADÁ rozpracované údaje. Naďalej treba exportovať XLSX. Pred zatvorením či aktualizáciou exportuj. Nová verzia sa pripraví pri online návšteve a použije po zatvorení všetkých okien tejto aplikácie; neobnovuje rozpracovanú stránku automaticky.

## Zdroj a overenie

Zdrojové súbory sú v dist, šablóna v index.source.html. Po úpravách spusti node scripts/build-standalone.cjs. Testovacie dáta sú výlučne v demo-fixture.cjs, do publikovaného súboru sa nevkladajú. Testy: tests.cjs, bulk-test.cjs, standalone-test.cjs, smoke.cjs. Smoke je test udalostí s náhradným DOM, nie test vzhľadu v prehliadači.
