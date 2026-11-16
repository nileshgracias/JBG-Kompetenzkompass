# Kompetenzkompass – unveröffentlichte Vorschau, 16.11.2026

Dieser Bericht dokumentiert die zunächst unveröffentlichte Servervorschau. Anschließend wurde eine klar gekennzeichnete Browsersimulation als Version 3 für GitHub Pages ergänzt; die private Sites-Version wurde dabei nicht verändert. Dieser Stand enthält ausschließlich fiktive Daten und dient der gemeinsamen Prüfung vor einer gesammelten Veröffentlichung.

## Enthalten

1. Auswahl: Fach/Kurs → Klasse oder „Alle Klassen des Kurses“ → Kursmitglied. Ein fester Klasseneintrag am Kind verhindert doppelte Dokumente durch unterschiedliche Filter.
2. Eigene, breite Schülerkachel direkt unter der gesamten Auswahlkachel. Darunter Schuljahr und Quartal, danach Kompetenzen.
3. Historische Quartale als freigegebene Momentaufnahmen; aktuelle Quartale zunächst bearbeitbar.
4. Freigabe nur durch den Beauftragten. Der Server hält Bewertungen, ausgewählte Zeugnisbausteine, Vorlagentexte und fertigen Fließtext im freigegebenen Original fest. Spätere Katalogänderungen verändern diese Momentaufnahmen nicht.
5. „Korrektur beantragen“ neben dem Status des ausgewählten Zeitraums. Ein Antrag enthält Ziel, gewünschte Änderung und Begründung. Der Beauftragte kann ihn ablehnen oder einen begründeten, wiederum freigegebenen Nachtrag hinzufügen. Original und ältere Nachträge bleiben erhalten.
6. Diagramm mit „Alle Fachkompetenzen“ beziehungsweise „Alle überfachlichen Kompetenzen“, Einzelauswahl, farbigen Linien und Linienmustern, klickbarer Legende und Detailanzeige je Quartal. Die bisherige Tabelle bleibt erhalten.

## Vorschau starten

Node.js 22 oder neuer; keine zusätzlichen Pakete erforderlich.

    npm run dev

Der Server startet standardmäßig auf Port 4173. Bei Bedarf PORT als Umgebungsvariable setzen. Im verwalteten ChatGPT-Arbeitsbereich wird er durch die Vorschau-Funktion gestartet.

Die Auswahl „Demo-Rolle“ demonstriert eine Lehrkraft und eine/n Beauftragte/n. Der Server erzeugt dazu sitzungsgebundene, zufällige HttpOnly-Cookies und prüft die Rolle bei Schreiboperationen. Diese frei wählbaren Demoidentitäten sind ausdrücklich keine persönliche Anmeldung für den Schulbetrieb. Die Vorschau darf mit diesen Sitzungen nicht unverändert öffentlich veröffentlicht werden.

Die serverseitigen Testdaten liegen lokal unter `.preview-data/` und gehören nicht in das öffentliche GitHub-Repository. Beim ersten Start werden alle sechs fiktiven Kursmitglieder und ihre Historie angelegt. Das Quellarchiv enthält keine Browser-Sitzungen und keine Laufzeitdaten.

## Tatsächlich ausgeführte Prüfungen

- Syntaxprüfungen von app.js, workflow-ui.js, ledger.mjs und preview-server.mjs.
- Sechs Workflow-Testgruppen mit `node --test workflow.test.mjs`: Kurszugehörigkeit, historische Freigaben, fehlende Identität, Rollenprüfung, nicht überschreibbare Freigaben, eingefrorene Katalogtexte, Korrekturpflicht mit Antrag, Originalerhalt, Nachtrag, Ablehnung, ungültige Bewertungen, Versionskonflikte und doppelte offene Anträge.
- Bestehende sieben Backend-Prüfungen für Konfigurationsspeicherung.
- Browserdurchlauf: Fach → alle Klassen → Sam Winter aus 8b; Bewertung und Zeugnisbaustein erfassen; als Beauftragter freigeben; als Lehrkraft gesperrte Felder und Korrekturantrag prüfen; als Beauftragter Nachtrag ausführen. Originaltext und korrigierter Text wurden anschließend getrennt im gespeicherten Datensatz verifiziert.
- Diagramm im Browser: vier fachliche und 14 überfachliche Linien, Ausblenden einer Linie auf 13, Einzelauswahl auf eine Linie und Detailanzeige mit Kompetenz, Schuljahr, Quartal und Bewertung.

## Grenzen vor Veröffentlichung

Die Freigabesperre wird in der Vorschau serverseitig gegen App-/API-Bearbeitung geprüft. Direkter Zugriff auf Serverdateien durch Systemadministration ist damit kein rechtlich revisionssicheres Archiv. Für den Schulbetrieb fehlen weiterhin persönliche Konten, konkrete schulische Berechtigungen, ein abgestimmtes Aufbewahrungskonzept und die Freigabe für echte Daten.

Der bisherige öffentliche GitHub-Pages-Auftritt kann kein solches Backend ausführen. Die produktive Anbindung und Rollenfestlegung werden vor einer Veröffentlichung separat umgesetzt; diese Vorschau verwendet ihren eigenen Server und verändert keine bestehende Live-Speicherung. `build-host.mjs` ist noch der vorherige Version-2-Build und darf nicht zur Veröffentlichung dieser Vorschau verwendet werden.

Die Beispielwerte bilden Kategorien ab; Verbindungslinien sind keine metrische Leistungsbewertung. Unterstützungsbedarf wird nicht aus Bewertungen oder Profilbildern abgeleitet.
