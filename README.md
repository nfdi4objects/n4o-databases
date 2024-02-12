# Forschungsdatenbanken in NFDI4Objects

Dieses Repository enthält Verweise auf Forschungsdatenbanken von Mitgliedern des NFDI4Objects-Konsortiums, die für NFDI4Objects relevant sind.

## Dokumentation

Der Datensatz besteht aus der CSV-Datei [`no4-databases.csv`] mit zwei Spalten:

- `name` der Datenbank
- `wikidata` Identifier der Datenbank (QID)

Alle weiteren Informationen werden in Wikidata eingetragen und von dort abgerufen und in die Datei [`n4o-databases.json`] geschrieben. Jede Datenbank ist dabei mit folgenden Feldern beschrieben:

- `name` der Datenbank
- `wikidata` URI in Wikidata
- `url`  Homepage
- `publisher` Herausgeber
- `apis` Schnittstellen mit `url`, `protocol` und `format`

In Wikidata sollten folgende Angaben eingetragen werden:

- [offizielle Website](https://www.wikidata.org/wiki/Property:P856) (P856)
- [Herausgeber](https://www.wikidata.org/wiki/Property:P98) (P98)
- [API-Endpunkt](https://www.wikidata.org/wiki/Property:P6269) (P6269) mit den Qualifikatoren
  - [Protokoll](https://www.wikidata.org/wiki/Property:P2700) (P2700)
  - [Dateiformat](https://www.wikidata.org/wiki/Q1249973) (P2701)

## Zusammenführen der Daten

Zum Zusammenführen der Daten aus [`no4-databases.csv`] und Wikidata Node benötigt:

    git clone https://github.com/nfdi4objects/n4o-databases.git
    npn install
    ./update.sh

## Lizenz

Alle Daten stehen als Public Domain (CC0) frei zur Verfügung. 

[`no4-databases.csv`]: no4-databases.csv
[`no4-databases.json`]: no4-databases.json
