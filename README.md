# NeovaluesDeutsch

NeovaluesDeutsch ist eine deutschsprachige, für Smartphone, Tablet und Desktop gestaltete Version des politischen Werte-Tests NeoValues. Der Test führt durch Fragen zu politischen und gesellschaftlichen Themen und zeigt anschließend passende Werte und Ideologien an.

> Dieses Projekt ist eine unabhängige Bearbeitung des Originalprojekts. Es wird nicht von den ursprünglichen Projektverantwortlichen unterstützt oder offiziell herausgegeben.

## Funktionen

- Politischer Werte-Test mit Fragen und Antwortpfaden
- Übersicht der enthaltenen Werte und Ideologien mit Detailseiten
- Anpassung an unterschiedliche Bildschirmgrößen
- Hell- und Dunkelmodus
- Als installierbare Web-App (PWA) nutzbar
- Grundfunktionen sind nach dem Laden dank eines Hintergrunddienstes (Service Worker) auch ohne Internet verfügbar
- Testergebnisse und gewähltes Design werden lokal im Browser gespeichert; die Ergebnisse werden nicht an einen Server gesendet

## Lokal starten

Die Dateien dürfen für den Test nicht einfach per Doppelklick über `file://` geöffnet werden. Der Quiz-Fragebogen lädt eine JSON-Datei und die installierbare Web-App verwendet einen Hintergrunddienst (Service Worker); beides benötigt `localhost` oder eine HTTPS-Adresse.

Mit Python:

```powershell
cd "C:\Users\admin\Desktop\NeovaluesGermanFork\NeoValuesDeutsch"
python -m http.server 8000
```

Öffne danach im Browser:

```text
http://localhost:8000
```

Beende den Server im Terminal mit `Ctrl+C`.

Es sind keine zusätzlichen Pakete oder ein Build-Schritt erforderlich.

## Auf GitHub Pages veröffentlichen

1. Erstelle auf GitHub ein Repository für das Projekt.
2. Lade den gesamten Inhalt dieses Ordners in das Repository hoch. `index.html` muss im veröffentlichten Stammverzeichnis liegen; auch der Ordner `icons/` wird benötigt.
3. Öffne im Repository **Einstellungen → Pages**.
4. Wähle unter **Erstellung und Bereitstellung** die Veröffentlichung aus dem Hauptzweig `main` und dem Stammverzeichnis (`/`).
5. Öffne die angezeigte GitHub-Pages-Adresse. Die Veröffentlichung kann nach dem Speichern einige Minuten dauern.

GitHub Pages stellt die Seite über HTTPS bereit. Das ist Voraussetzung dafür, dass der Service Worker außerhalb von `localhost` funktioniert.

## Als PWA installieren

Rufe die veröffentlichte HTTPS-Adresse auf:

- **Android / Chrome oder Edge:** Browsermenü öffnen und **App installieren** oder **Zum Startbildschirm hinzufügen** auswählen.
- **Desktop-PC / Chrome oder Edge:** Installationssymbol in der Adressleiste oder **App installieren** im Browsermenü auswählen.
- **iPhone / iPad:** In Safari **Teilen** öffnen und **Zum Home-Bildschirm** auswählen.

Die Installationsoptionen hängen vom Betriebssystem und Browser ab. Bei Änderungen an den Dateien kann ein bereits installierter Service Worker noch eine ältere Version zwischenspeichern. Dann die Seite neu laden oder die Website-Daten im Browser löschen.

## Projektdateien

- `index.html`: Startseite
- `Instruction.html`, `quiz.html`, `quiz.js`, `questions_tree.json`: Anleitung und Quiz
- `results.html`: Auswertung
- `values.html`, `ideologies.html`, `description.html`: Übersichten und Detailbeschreibungen
- `data.js`: Werte, Ideologien, Beschreibungen und Quellen
- `style.css`, `theme.js`: Gestaltung, Designmodus und Service-Worker-Registrierung
- `manifest.webmanifest`, `sw.js`, `icon.svg`: PWA-Metadaten, Offline-Cache und App-Symbol
- `about.html`, `contact.html`, `privacy.html`, `impressum.html`, `support.html`: Informationen, Kontakt und Hilfe
- `LICENSE`: Lizenztext des Originalprojekts

## Lizenz und Namensnennung

Das ursprüngliche NeoValues-Projekt steht unter der **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**. Die Lizenzdatei liegt in [`LICENSE`](LICENSE).

Das Projekt basiert auf [NeoValues von neomediavalist](https://github.com/neomediavalist/neovalues). Bei einer Weitergabe müssen die Namensnennung und der Lizenzhinweis erhalten bleiben, Änderungen müssen kenntlich gemacht werden, und bearbeitete Fassungen müssen unter CC BY-NC-SA 4.0 oder einer kompatiblen Lizenz weitergegeben werden. Die Nutzung ist auf nichtkommerzielle Zwecke beschränkt. Für kommerzielle Nutzung ist eine gesonderte Erlaubnis der Rechteinhaber erforderlich.

Diese Hinweise sind eine allgemeine Zusammenfassung und keine Rechtsberatung. Die Lizenz gilt nur für Material, für das die jeweiligen Rechteinhaber sie erteilen durften; separate Inhalte oder Rechte können zusätzlichen Bedingungen unterliegen.

## Kontakt

Manuel Habetswallner: [manuel.habetswallner@gymried.at](mailto:manuel.habetswallner@gymried.at)
