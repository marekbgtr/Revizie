# Revízie SPS – pracovná evidencia v1.7

Aplikácia sa spustí bez dát. Vždy načítaj posledný exportovaný XLSX cez Načítať Excel.

## Spoločná revízna správa

1. V Zariadeniach nastav filtre (stredisko, kategória, hľadané umiestnenie).
2. Označ zariadenia alebo vyber všetky vo filtri. Výber platí cez všetky strany; upozornenie zobrazuje aj počet vybraných mimo filtra.
3. Zvoľ Priradiť dokument alebo Zapísať spoločnú revíziu.
4. Zadaj nový dokument alebo vyber existujúci. Pri novom zadaj názov, číslo správy a vyber PDF alebo zadaj existujúci odkaz.
5. Pri revízii vyplň spoločné údaje, každému zariadeniu vyber jeho kontrolu a over navrhnutý nasledujúci termín. Výsledok je spoločný, rozdielne výsledky spracuj oddelene.
6. Ulož a exportuj Excel. Pri ďalšej práci načítaj tento export.

Dokument je uložený raz v Dokumenty. Väzby sú v DokumentZariadenia a DokumentRevizie. Revízia vznikne pre každý vybraný plán zvlášť. Rovnaký deň pre rovnaký plán sa pri hromadnom zápise odmietne ako možná duplicita. Starší historický zápis neprepíše aktuálny plán. Stav fyzickej kontroly podkladov sa nemení automaticky.

## PDF na sieťovom disku – nové vo v1.7

1. Na PC otvor aplikáciu v Chrome alebo Edge cez HTTPS (napríklad na svojom GitHub Pages).
2. Načítaj aktuálny Excel. V Dokumenty → Vybrať priečinok vyber priečinok na firemnom sieťovom disku, kde tento Excel uchovávaš. Povoľ prehliadaču čítanie aj zápis.
3. V Zariadeniach označ príslušné zariadenia → Priradiť dokument alebo Zapísať spoločnú revíziu → Nový dokument. Vyber PDF (najviac 50 MB).
4. Po potvrdení sa PDF uloží do podpriečinka Dokumenty. Názov dostane jedinečný identifikátor; existujúce správy sa neprepisujú. Až po úspešnom uložení pribudne evidencia a väzby.
5. Exportuj Excel a ručne ulož aktuálny export do spoločného priečinka. Export nie je automatický zápis na sieťový disk.
6. PDF otvoríš v detaile dokumentu cez Otvoriť priradené PDF. Existujúcemu dokumentu bez odkazu môžeš doplniť PDF v jeho detaile.

Výber priečinka si aplikácia skúsi zapamätať. Pri ďalšom spustení môžeš potrebovať tlačidlo Povoliť prístup. Ak zmeníš priečinok, potvrdzuješ nové miesto pre čítanie aj ukladanie; aplikácia staré súbory nepresúva. Ak disk nie je dostupný, ukladanie zlyhá a formulár zostane otvorený. Pri páde spojenia môže na disku zostať nedokončený súbor, ak ani jeho odstránenie nie je dostupné.

V XLSX je len relatívna cesta Dokumenty/nazov_identifikator.pdf. Na ďalšom PC vyber rovnaký spoločný priečinok; písmeno namapovanej jednotky sa môže líšiť. Pri presune zachovaj Excel a Dokumenty spolu. Priradené PDF samostatne nepremenúvaj ani nepresúvaj. PDF sa neposiela na GitHub ani server aplikácie a nie je súčasťou XLSX ani miestnej zálohy zošita.

Priamo na firemnom disku treba prvý zápis overiť: dostupnosť sieťového disku, práva Windows a firemné pravidlá prehliadača. Ak firma blokuje výber alebo zápis do priečinka, rieši to IT. Táto funkcia je určená pre PC; na mobile naďalej funguje práca s evidenciou a XLSX.

Automatické testy pokrývajú ukladanie/čítanie PDF s náhradným súborovým rozhraním, odmietnuté povolenie, výpadok, neúspešné zatvorenie zápisu, kolíziu názvov, validáciu pred zmenami a prenos relatívnej cesty cez XLSX. Firemný sieťový disk ani natívny dialóg Windows tu neboli dostupné na overenie.

## Automatické miestne uloženie a verzia súboru

Po načítaní a každej potvrdenej úprave sa uloží miestna pracovná kópia. Pred zatvorením počkaj na hlásenie „Uložené v tomto zariadení“. Pri ďalšom otvorení sa práca automaticky obnoví. Rozpísané formuláre ešte nepotvrdené tlačidlom sa neukladajú. Pri chybe úložiska zostáva dostupný export; hlásenie NEULOŽENÉ neignoruj.

Záloha je v tomto profile prehliadača a na tejto webovej adrese. Nie je synchronizovaná medzi telefónom a PC ani medzi GitHub a ChatGPT verziou. Vymazanie údajov webu, anonymný režim či zásah prehliadača môže zálohu odstrániť. Pravidelne exportuj. Pri načítaní iného zošita sa aktuálna miestna kópia nahradí; pri neexportovaných zmenách sa zobrazí potvrdenie.

Export má názov napríklad real_export_2026-10-09_22-49-48_d8c2e980.xlsx. Čas je v pásme Europe/Bratislava. Dátum/čas a jedinečné ID sú tiež vo vlastných vlastnostiach XLSX a zobrazia sa po načítaní aj pri premenovaní súboru. Exportovaný súbor musíš skutočne stiahnuť; aplikácia nevie potvrdiť dokončenie sťahovania. Údaj označuje export z tejto aplikácie, nie následné zmeny v Exceli. Čas závisí od správne nastavených hodín exportujúceho zariadenia.

Pri prenose: exportuj v telefóne → ulož/prenes súbor cez OneDrive → na PC načítaj tento XLSX a porovnaj čas a ID. Aplikácia upozorní na starší export, než tento prehliadač už pozná; nevie zistiť novšiu verziu, ktorú ešte nedostal.

## GitHub Pages a telefón

Rozbaľ celý balík Revizie_SPS_PWA_v1.7.zip. Všetky jeho súbory nahraj vedľa seba do priečinka, z ktorého publikuješ GitHub Pages; index.html nahraď. Samotný ZIP nenahrávaj. Potrebné sú index.html, sw.js, manifest.webmanifest, icon-192.png, icon-512.png a apple-touch-icon.png. Tentoraz nestačí vymeniť iba index.html. V päte musí byť v1.7.

Android / Chrome: otvor svoju webovú adresu online, potom menu ⋮ → Pridať na plochu → Inštalovať. Alebo použi tlačidlo Nainštalovať aplikáciu, keď ho Chrome ponúkne. iPhone / Safari: Zdieľať → Pridať na plochu (Otvoriť ako webovú aplikáciu, ak sa ponúkne).

Po hlásení, že je offline režim pripravený, sa samotná aplikácia otvorí aj bez internetu. XLSX a PDF musia byť uložené v telefóne; odkazy na OneDrive potrebujú internet. Vymazanie údajov prehliadača môže odstrániť offline kópiu, vtedy otvor aplikáciu znovu online.

Miestne automatické uloženie nenahrádza export pre prenos medzi zariadeniami. Pred zatvorením či aktualizáciou exportuj. Nová verzia sa pripraví pri online návšteve a použije po zatvorení všetkých okien tejto aplikácie; neobnovuje rozpracovanú stránku automaticky.

## Zdroj a overenie

Zdrojové súbory sú v dist, šablóna v index.source.html. Po úpravách spusti node scripts/build-standalone.cjs. Testovacie dáta sú výlučne v demo-fixture.cjs, do publikovaného súboru sa nevkladajú. Testy: tests.cjs, bulk-test.cjs, standalone-test.cjs, smoke.cjs. Smoke je test udalostí s náhradným DOM, nie test vzhľadu v prehliadači.

## Karta zariadenia

V detaile zariadenia zvoľ Tlačiť kartu. V zozname môžeš označiť viac zariadení a zvoliť Tlačiť karty. Predvolene sú riadky revízií prázdne na ručné zápisy; voľba Vyplniť evidovanú históriu doplní nezrušené záznamy. Historický interval sa nedopočítava z dnešného intervalu: doplň ho podľa papierovej správy.

Tlač / PDF používa A4 na výšku a ľavý okraj 18 mm na zakladanie. V tlačovom dialógu vypni hlavičky a päty prehliadača. Každé zariadenie začína na novej strane; dlhšie poznámky či história môžu pokračovať na ďalšej. Tlačia sa potvrdené údaje zo zošita vrátane miestnych úprav, nie rozpísaný formulár. Tlač nemení údaje.

## Mobilné záhlavie

Hore zostávajú Načítať Excel, Exportovať Excel a stručný stav miestneho uloženia. Názov súboru, čas/ID exportu a offline stav otvoríš cez Súbor a verzia. Počet neexportovaných zmien zostáva viditeľný aj pri zbalenom detaile. Inštalácia je v Ako to funguje, dostupná aj pred načítaním zošita. Chyby uloženia zostávajú viditeľné; upozornenie na aktualizáciu rozbalí detail.
