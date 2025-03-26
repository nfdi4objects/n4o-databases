all: n4o-databases.json n4o-databases.ttl n4o-collections.json n4o-collections.ttl

# TODO: retrieve from Wikidata
#n4o-databases.json: n4o-databases.csv
#	@npm run -s ... -- < $< > $@

n4o-databases.ttl: n4o-databases.json
	npm run jsonld2rdf -- -c context.json -p prefixes.json $< > $@

n4o-collections.json: n4o-collections.csv
	@npm run -s csv2json -- < $< > $@

n4o-collections.ttl: n4o-collections.json
	npm run jsonld2rdf -- -c context.json -p prefixes.json $< > $@
