all: n4o-collections.json pg

n4o-collections.json: n4o-collections.csv
	@npm run -s csv2json -- < $< > $@

pg: n4o-collections.pg

n4o-collections.pg: n4o-collections.csv
	@./pg.py > $@
	@wc -l $@
