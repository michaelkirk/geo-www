DEFAULT: dev

SERVER_PORT=8000
REPO_ROOT:=$(shell git rev-parse --show-toplevel)

##
# Section: Tasks (Phony targets)
##

APPS=geo-www

.PHONY: serve clean dev release $(APPS)
.PRECIOUS: src/%/wasm_pkg

TSC=npx tsc --lib dom,es2020 --module es2020 --target es6 --strict --noEmitOnError

clean:
	rm -fr build
	rm -fr src/*/wasm_pkg

# Build all apps for distribution (optimized)
# This assume's you'll upload any required data to the web-root separately.
release: export WASM_PACK_FLAGS=--release
# note: `clean` is because we don't know if any cached wasm files were optimized
# Once you've compiled the optimized wasm this way, you can skip `clean` and just run `make build`, since the remaining output is identical for dev vs release
release: clean build

# Build all apps for local dev, and symlink the data dir into the web-root.
dev: export WASM_PACK_FLAGS=--dev
dev: build

serve: build
	cd build/dist && python3 -m http.server $(SERVER_PORT)

##
# Section: Shared Deps and Templates
##

# Build all of our apps
build: $(APPS)

build/dist/%.html: src/web_root/*.html
	# just copy everything... we could do something more nuanced
	cp -r src/web_root/* build/dist

# We rebuild wasm when any of these files change. 
#
# Because Make doesn't know about rust's build system, it's pretty naive:
# changing any rust file in any crate will trigger rebuilding the wasm 
# (the rebuilds themselves should be pretty fast due to incremental compilation)
RUST_SOURCES=$(shell find ../ -name \*.rs)

# simply copies over the wasm pkg we 
# built to be able to compile our typescript
build/dist/%/wasm_pkg: src/%/wasm_pkg
	mkdir -p $(dir $@)
	cp -r "${<}" $(dir $@)

build/dist/%.js: src/%.ts
	mkdir -p $(dir $@)
	$(TSC) --outdir $(dir $@) $^

## App
geo-www: build/dist/geo-www/wasm_pkg build/dist/geo-www build/dist/index.html build/dist/geo-www/index.js

src/geo-www/wasm_pkg: $(RUST_SOURCES)
	bin/build-wasm . geo-www
	touch $@
