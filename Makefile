all: rdf pg

rdf: n4o-sources.nt n4o-sources.ttl

n4o-collections.json: n4o-collections.csv
	@node csv2json.js < $< > $@

n4o-sources.nt: n4o-collections.json
	@npm run --silent jsonld2rdf -- $^ -c context.json > $@
	@wc -l $@

n4o-sources.ttl: n4o-collections.json
	@npm run --silent jsonld2rdf -- $^ -c context.json -p prefixes.json > $@
	@echo $@

pg: n4o-collections.pg

n4o-collections.pg: n4o-collections.csv
	@./pg.py > $@
	@wc -l $@

n4o-sources-pg.json: n4o-sources.pg
	@npm run pgraph -- $< $@ 
