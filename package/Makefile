build: tscompile
	node ./scripts/run.js

tscompile:
	sh ./scripts/foldup.sh

live:
	sh ./scripts/live.sh

run:
	node ./scripts/run.js

final: tscompile
	node ./scripts/final.js

ADDON_DIRS = ../addons/vue-addon ../addons/more-styles-addon


addons:
	for i in $(ADDON_DIRS); do \
		cd $$i; \
		yarn types; \
		cd ../../package; \
	done
