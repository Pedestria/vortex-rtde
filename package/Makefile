build: tscompile
	node ./scripts/run.js

tscompile:
	./scripts/foldup.sh

live:
	./scripts/live.sh

run:
	./scripts/run.sh

final: tscompile
	node ./scripts/final.js

ADDON_DIRS := ../addons/vue-addon ../addons/more-styles-addon


addons:
	for i in $(ADDON_DIRS); do \
		cd $$i; \
		yarn types; \
		cd ../../package; \
	done

