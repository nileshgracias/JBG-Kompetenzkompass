# JBG Kompetenzkompass · Demo Version 3

Öffentliche Demo: https://nileshgracias.github.io/JBG-Kompetenzkompass/

## Neu in Version 3

- Fach/Kurs → Klasse oder „Alle Klassen des Kurses“ → Schüler/in.
- Eigene Schülerkachel unter der gesamten Auswahl, danach Schuljahr und Quartal.
- Freigabestatus sowie Korrekturantrag, Prüfung und begründeter Nachtrag; Original und ältere Nachträge bleiben innerhalb des Demoablaufs erhalten.
- Gesamtansicht aller Fachkompetenzen oder überfachlichen Kompetenzen, Einzelansicht, ausblendbare Linien und Detailanzeigen. Die bisherige Tabelle bleibt erhalten.

## Wichtige Unterscheidung

**GitHub Pages:** `static-demo.js` simuliert die API lokal im Browser. Rollen, Freigaben und Korrekturen sind ausschließlich eine Funktionsdemonstration. Es gibt keine serverseitige Sperre, keine persönliche Anmeldung und kein revisionssicheres Archiv. Browserdaten lassen sich verändern oder löschen. Keine echten Schülerdaten eingeben.

**Lokale Servervorschau:** `npm run dev` startet `preview-server.mjs`. Hier prüft der Server die Demo-Sitzung und Rolle; `ledger.mjs` schützt freigegebene Momentaufnahmen vor normalen Schreiboperationen und führt Korrekturen nur als Nachtrag aus. Auch hier sind die frei wählbaren Rollen keine schulischen Konten. Details und ausgeführte Tests stehen in [VORSCHAU.md](VORSCHAU.md).

Die bereits bestehende private Sites-Instanz wurde bei diesem GitHub-Update nicht verändert und zeigt weiterhin ihren bisherigen Stand. `build-host.mjs` gehört zum alten Version-2-Worker und ist kein Deploymentweg für Version 3.

## Technischer Aufbau

Die öffentliche App benötigt keinen Build: `index.html`, `app.js`, `workflow-ui.js`, `static-demo.js`, `ledger.mjs`, `backend.mjs`, `config.json` und die Bilddateien werden direkt von GitHub Pages ausgeliefert. Es werden keine Serverdaten, Sitzungscookies oder Zugangsdaten ins Repository geschrieben.

Die lokale Demo speichert neue Datensätze unter `jbg-public-ledger-v3` und die Konfiguration unter `jbg-public-config-v3`; die vorigen Demo-Schlüssel bleiben unangetastet. Es gibt keine automatische Übertragung zur privaten Serverversion.

## Prüfungen

`npm test` prüft Freigaben, Rollen, Anträge, Nachträge, Originalerhalt, Versionskonflikte und die bestehende Konfigurations-API. Der statische GitHub-Modus wurde im Browser mit neuer Auswahl, vier Diagrammlinien, lokalem Speichern, Freigabe und gesperrten Eingabefeldern geprüft.

## Dokumentation des bisherigen Stands (Version 2)

Browserdemo für die Kompetenzdokumentation mit ausschließlich fiktiven Daten.

- Öffentliche Demo: https://nileshgracias.github.io/JBG-Kompetenzkompass/
- Private Serverversion: https://jbg-kompetenzkompass.coatedrobin1.chatgpt.site/

## Neu in Version 2

- Zwölf Quartale in den drei abgeschlossenen Schuljahren 2023/24, 2024/25, 2025/26; zusätzlich aktuelle Erfassung 2026/27.
- Diagramm pro Kompetenz, auswählbar für Fachkompetenzen und überfachliche Kompetenzen; Datentabelle für alle Kompetenzen.
- Sechs fiktive Profile mit KI-generierten Bildern, Stärken, Unterstützungsbedarf und hilfreichen Maßnahmen.
- Verwaltung für Kompetenzbeschreibungen, vier Zeugnisbausteine je Kompetenz, Schul- und Anwendungsnamen sowie Profiltexte.
- Ergänzen und Entfernen von Kompetenzen; stabile IDs erhalten bestehende Bewertungen bei Textänderungen.
- JSON-Export und -Import der Konfiguration.
- Privates Serverbackend mit dauerhaftem Konfigurationsspeicher, Validierung und Schutz gegen veraltete gleichzeitige Änderungen.

## Ausprobieren

Klasse 8a → WP Informatik → Alex Sommer. Unter Entwicklungsverlauf eine Kompetenz auswählen. Die Erfassung kann zwischen den Schuljahren und Quartalen wechseln. Q2 und Q4 bieten die Zeugnisvorbereitung.

Unter Verwaltung Texte ändern und speichern. In der GitHub-Pages-Version werden Änderungen nur in diesem Browser gespeichert. Im privaten Serverbereich werden Kataloge und Mustertexte zentral gespeichert und von anderen Geräten nach Anmeldung geladen. Die beiden Versionen sind getrennt; Änderungen lassen sich per Konfigurationsexport/-import übertragen. Es gibt keine automatische Synchronisation von der privaten Serverversion zur öffentlichen Demo.

## Architektur

`index.html`, `app.js`, `config.json`, `logo.png` und `portraits.jpg` bilden die statische GitHub-Pages-App. Pages kann kein Serverbackend ausführen.

`backend.mjs` enthält das Servermodul, `build-host.mjs` erstellt einen Cloudflare-Worker für die private Sites-Instanz. Voraussetzung ist ein serverseitiges R2-Binding namens `BUCKET` und eine private, auf den Eigentümer beschränkte Plattform-Zugriffskontrolle. Niemals dieses Backend ohne Zugriffskontrolle öffentlich betreiben. Der Modulcode enthält keine Zugangsdaten. Die private Bereitstellung verwendet die separate Sites-Quellverwaltung.

Der Server speichert ausschließlich die Demo-Konfiguration unter `demo/config-v2.json`. GET liefert eine Revision (ETag); PUT setzt If-Match, denselben Origin und X-JBG-Request voraus. Konkurrierende Änderungen werden mit 409 abgelehnt. Bewertungsdaten und Zeugnisentwürfe bleiben auch in der privaten Demo browserlokal.

## Grenzen und Datenschutz

Keine echten Schülerdaten eingeben. Alle Personen, Unterstützungsbedarfe und Bewertungen sind erfunden. Die Fotos wurden mit KI erzeugt. Unterstützungsbedarfe werden nicht aus Bildern oder Bewertungen abgeleitet und nicht automatisch in Zeugnisse übernommen.

Dies ist keine freigegebene Schülerdatenverwaltung. Klassen-/Fachrechte und die Koordinationsrolle sind simuliert, es gibt keine zentrale Schülerdatenbank und keine Zusammenführung mehrerer Lehrkräfte. Zeugnisformulierungen sind Muster ohne schulische oder rechtliche Freigabe.

Der wiederverwendete Access-Katalog über drei Jahre dient ausschließlich der Veranschaulichung und behauptet keine curriculare Zuordnung zu den jeweiligen früheren Jahrgängen. Die vier Bewertungsstufen sind ordinal; die Diagrammlinie ist eine Orientierung und keine metrische Leistungsmessung. Vorschläge extrapolieren die letzte Veränderung aus zwei vorherigen Werten, begrenzt auf vier Stufen; sie benötigen die Entscheidung der Lehrkraft.

## Prüfung

`node backend.test.mjs` prüft Speicheroperationen, Validierung, Origin-Prüfung und Versionskonflikte mit einem isolierten Speicheradapter. Syntaxprüfung: `node --check app.js`. Browserprüfung für Auswahl, Profil, Diagramm und Verwaltung; Live-Serverprüfung für Schreiben, erneutes Lesen und Wiederherstellen der Konfiguration.

Schullogo: Joseph Beuys Gesamtschule, https://jbg.kleve.de/. Keine gesonderte Nutzungslizenz erteilt.
