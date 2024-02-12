# Forschungsdatenbanken in NFDI4Objects

Dieses Repository enthält Verweise auf Forschungsdatenbanken von Mitgliedern des NFDI4Objects-Konsortiums, die für NFDI4Objects relevant sind.

## Dokumentation

Der Datensatz besteht aus der CSV-Datei [`n4o-databases.csv`] mit zwei Spalten:

- `name` der Datenbank
- `wikidata` Identifier der Datenbank (QID)

Alle weiteren Informationen werden in Wikidata eingetragen und von dort abgerufen und in die Datei [`n4o-databases.json`] geschrieben. Jede Datenbank ist dabei mit folgenden Feldern beschrieben:

- `name` der Datenbank
- `wikidata` QID in Wikidata
- `url`  Homepage
- `publisher` Herausgeber mit `name` und `wikidata` QID
- `api` Schnittstellen mit `url`, `protocol` und `format`

Zusätzlich wird die JSON-Datei als JSON-LD mit [diesem Kontext](context.json) nach RDF konvertiert und im NTriples-Format in der Datei [`n4o-databases.nt`] gespeichert. Dabei wird im Wesentlichen das Datenmodell des [NFDI4Culture Knowledge Graph](https://nfdi4culture.de/de/dienste/details/culture-knowledge-graph.html) verwendet mit folgenden Unterschieden:

- Zur Angabe einer Homepage wird `foaf:url` verwendet, da diese RDF Property bereits etabliert ist
- Es werden keinen eigenen URIs für Herausgeber, APIs und Dateiformate gebildet sondern Wikidata-URIs verwendet

## Erweiterung und Änderung der Daten

Die Datei [`n4o-databases.csv`] kann per Pull-Request in GitHub geändert werden.

In Wikidata sollten folgende Angaben eingetragen werden:

- [offizielle Website](https://www.wikidata.org/wiki/Property:P856) (P856)
- [Herausgeber](https://www.wikidata.org/wiki/Property:P98) (P98)
- [API-Endpunkt](https://www.wikidata.org/wiki/Property:P6269) (P6269) mit den Qualifikatoren
  - [Protokoll](https://www.wikidata.org/wiki/Property:P2700) (P2700)
  - [Dateiformat](https://www.wikidata.org/wiki/Q1249973) (P2701)

Ein Beispieldatesatz ist <https://www.wikidata.org/wiki/Q21040628> (KENOM).

## Zusammenführen der Daten

Zum Zusammenführen der Daten aus [`n4o-databases.csv`] und Wikidata Node benötigt:

    git clone https://github.com/nfdi4objects/n4o-databases.git
    npn install
    ./update.sh

## Lizenz

Alle Daten stehen als Public Domain (CC0) frei zur Verfügung. 

[`n4o-databases.csv`]: n4o-databases.csv
[`n4o-databases.json`]: n4o-databases.json
[`n4o-databases.nt`]: n4o-databases.nt
