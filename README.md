# Quellen für Forschungsdaten in NFDI4Objects

Dieses Repository enthält Verweise auf Forschungsdaten(banken) und -repositorien, die für NFDI4Objects relevant sind und in einem [Knowledge Graph](https://nfdi4objects.github.io/n4o-graph/) zusammengeführt werden sollen.

Eine HTML-Ansicht der Liste von Datenbanken befindet sich unter <https://nfdi4objects.github.io/n4o-databases/>.

## Dokumentation

Der Datensatz besteht aus zwei CSV-Dateien.

### Databases

Die Liste von Forschungsdatenbanekn und Repositorien [`n4o-databases.csv`] mit zwei Spalten:

- `name` der Datenbank
- `wikidata` Identifier der Datenbank (QID)

Weitere Informationen werden in Wikidata eingetragen und von dort abgerufen und in die Datei [`n4o-databases.json`] geschrieben. Jede Datenbank ist dabei mit folgenden Feldern beschrieben:

- `name` der Datenbank
- `wikidata` QID in Wikidata
- `url`  Homepage
- `publisher` Herausgeber mit `name` und `wikidata` QID
- `re3data` Identifier bei <https://www.re3data.org/>
- `api` Schnittstellen mit `url`, `protocol` und `format`

Zusätzlich wird die JSON-Datei als JSON-LD mit [diesem Kontext](context.json)
nach RDF konvertiert und im NTriples-Format in der Datei [`n4o-databases.nt`]
gespeichert und im Turtle-Format in der Datei [`n4o-databases.ttl`].
Dabei wird im Wesentlichen das Datenmodell des [NFDI4Culture
Knowledge Graph](https://nfdi4culture.de/de/dienste/details/culture-knowledge-graph.html)
verwendet mit folgenden Unterschieden:

- Zur Angabe einer Homepage wird `foaf:url` verwendet, da diese RDF Property bereits etabliert ist
- Es werden keinen eigenen URIs für Herausgeber, APIs und Dateiformate gebildet sondern Wikidata-URIs verwendet

Darüber hinaus werden die Daten als Property Graph in den Dateien [`n4o-databases-pg.json`] und [`n4o-databases.pg`] als PG-JSON bzw. PG format gespeichert.

### Collections

In [`n4o-collections.csv`] stehen bekannte Sammlungen und
Datenpublikationen, deren Daten übernommen werden können und falls vorhanden
die dazu gehörige übergeordnete Datenbank aus [`n4o-databases.csv`].

Das Skript `pg.py` konvertiert die Datei `n4o-collections.csv` ins PG format.
Mit `make` wird damit die Datei `no4-collections.pg` aktualisiert. Diese Datei
kann mit `n4o-databases.pg` zusammengeführt werden.


## Erweiterung und Änderung der Daten

Die Dateien [`n4o-databases.csv`] und [`n4o-collections.csv`] können per Pull-Request in GitHub geändert werden.

Für Datenbanken und Repositorien sollen in Wikidata folgende Angaben eingetragen werden:

- [offizielle Website](https://www.wikidata.org/wiki/Property:P856) (P856)
- [Herausgeber](https://www.wikidata.org/wiki/Property:P98) (P98)
- [API-Endpunkt](https://www.wikidata.org/wiki/Property:P6269) (P6269) mit den Qualifikatoren
  - [Protokoll](https://www.wikidata.org/wiki/Property:P2700) (P2700)
  - [Dateiformat](https://www.wikidata.org/wiki/Q1249973) (P2701)

Ein Beispieldatesatz ist <https://www.wikidata.org/wiki/Q21040628> (KENOM).

Zusätzlich sollte die Datenbank bei <a href="https://www.re3data.org/">re3data.org</a> eingetragen werden,
von wo weitere Informationen übernommen werden können.

## Zusammenführen der Daten

Zum Zusammenführen der Daten aus [`n4o-databases.csv`] und Wikidata wird Node benötigt:

    git clone https://github.com/nfdi4objects/n4o-databases.git
    npn install
    ./update.sh

## Lizenz

Alle Daten stehen als Public Domain (CC0) frei zur Verfügung. 

[`n4o-databases.csv`]: n4o-databases.csv
[`n4o-collections.csv`]: n4o-collections.csv
[`n4o-collections.pg`]: n4o-collections.pg
[`n4o-databases.json`]: n4o-databases.json
[`n4o-databases.nt`]: n4o-databases.nt
[`n4o-databases.ttl`]: n4o-databases.ttl
[`n4o-databases-pg.json`]: n4o-databases-pg.json
[`n4o-databases.pg`]: n4o-databases.pg
