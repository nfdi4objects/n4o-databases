all: rdf pg

n4o-collections.json: n4o-collections.csv
	@node csv2json.js < $< > $@

pg: n4o-collections.pg

n4o-collections.pg: n4o-collections.csv
	@./pg.py > $@
	@wc -l $@
