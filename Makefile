RELEASE_VERSION:=$(shell grep em:version install.rdf | head -n 1 | sed -e 's/ *<em:version>//' -e 's/<\/em:version>//' | sed 's/ //g')
all: logseqserver.xpi

logseqserver.xpi: chrome/content/logseqserver/main.js chrome/content/logseqserver/overlay.xul chrome.manifest install.rdf manifest.json bootstrap.js manifest.json
	rm -rf $@
	zip -r $@ chrome chrome.manifest install.rdf manifest.json bootstrap.js

version: install.rdf
	@echo "${RELEASE_VERSION}"
