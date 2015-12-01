# boop

all:
	cd js/;	babel *.es6 --out-dir ../static/rendered/

clean:
	rm static/rendered/*
