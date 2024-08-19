all: n4o-collections.pg n4o-databases.pg

n4o-databases.pg: n4o-databases.csv
	@npm run --silent update

n4o-collections.pg: n4o-collections.csv
	@./pg.py > $@
	@wc -l $@
