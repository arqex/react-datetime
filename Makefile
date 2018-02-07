.PHONY: all clean install test

clean:
	rm -rf node_modules

install:
	npm install

prettify:
	echo '## Running Prettifier' &&
	./node_modules/.bin/prettier --write DateTime.js src/*.js test/*.js example/*.js demo/src/*.js"

test:
	npm run test

test-watch:
	npm run test:watch
