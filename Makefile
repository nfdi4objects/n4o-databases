all: n4o-collections.json

n4o-collections.json: n4o-collections.csv
	@npm run -s csv2json -- < $< > $@
