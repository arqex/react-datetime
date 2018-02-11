.PHONY: all clean dev install snapshot test test-watch

clean:
	rm -rf node_modules

dev:
	npm run dev

install:
	npm install

snapshot:
	npm run test:snapshot:update

test:
	npm run test

test-watch:
	npm run test:watch
