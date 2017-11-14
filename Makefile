.PHONY: all clean install test

clean:
	rm -rf node_modules

install:
	npm install

test:
	npm run test

test-watch:
	npm run test:watch
