
build: components javascripts/index.js
	@component build --dev --watch

components: component.json
	@component install --dev

test:
	open test/index.html

clean:
	rm -rf build components

.PHONY: test watch build clean
