import EndpointInterface from '../types/EndpointInterface';
export default class Annotation implements EndpointInterface {

    supportedDataTypes = ['application/json'];
    supportedMethods = ['POST'];
    permitBookmarklet = false;

    public async init(request: any) {
        const libraryID = Zotero.Server.Connector.getSaveTarget(true).library.libraryID;
        const key = request.data;
        if (!this.validKey(key))
            return [404, 'application/json', JSON.stringify({error: 'Invalid key'})]
        //const item = await Zotero.Items.get(key);
        const items = await Zotero.API.getResultsFromParams({libraryID, objectType: 'item', objectKey: key});
        if (items.length == 0)
            return [404, 'application/json', JSON.stringify({error: 'Annotation not found'})]
        const item = items[0];
        const citationKey = Zotero.BetterBibTeX.KeyManager.get(item.parentID).citationKey
        return [200, 'application/json', JSON.stringify({parentKey: item.key, citationKey, item: item})];
    }
    validKey(key: string) {
        return  key.match(/^[A-Z0-9]+$/)
    }

}
