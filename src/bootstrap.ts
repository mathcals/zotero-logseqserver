import LogseqServer from './logseqserver';

async function startup({ id, version, resourceURI, rootURI = resourceURI.spec }: StartupArgs) {

    Zotero.ZLogseqServer = new LogseqServer();
    Zotero.ZLogseqServer.start();

    // Fix to allow Zotero to send binary data
    Zotero.Server.DataListener.prototype._requestFinishedOld = Zotero.Server.DataListener.prototype._requestFinished;
    Zotero.Server.DataListener.prototype._requestFinished = function (response: any, options: any) {
        if (options === undefined || options.rawData === undefined)
            this._requestFinishedOld(response, options);

        if (this._responseSent) {
            return;
        }
        this._responseSent = true;
        this.iStream.close();
        const intlStream = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
            .createInstance(Components.interfaces.nsIConverterOutputStream);
        try {
            intlStream.init(this.oStream, "UTF-8", 1024, "?".charCodeAt(0));
            intlStream.writeString(response.substr(0, response.length - 1));
            this.oStream.write(options.rawData, options.rawData.length);
        } finally {
            intlStream.close();
        }
    }

    // Fix to add parentId to JSON-serialized annotations
    Zotero.Annotations.toJSONOld = Zotero.Annotations.toJSON;
    Zotero.Annotations.toJSON = async function (item: any) {
        const json = await Zotero.Annotations.toJSONOld(item);
        json.parentId = item.parentItem.id;
        return json
    }
}

globalThis.startup = startup;