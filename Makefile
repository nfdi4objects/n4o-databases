all: n4o-collections.pg n4o-databases.pg n4o-databases.nt

n4o-databases.nt: n4o-databases.json
	@npm run --silent jsonld2nt -- $< -c context.json > $@
	@wc -l $@

n4o-collections.nt: n4o-collections.json
	@npm run --silent jsonld2nt -- $< -c context.json > $@
	@wc -l $@

n4o-databases.pg: n4o-databases.csv
	@npm run --silent update

n4o-collections.pg: n4o-collections.csv
	@./pg.py > $@
	@wc -l $@

n4o-source.nt: n4o-collections.nt n4o-databases.nt
	cat $^ > $@
