import EndpointInterface from '../types/EndpointInterface';

export default class Search implements EndpointInterface {
    supportedMethods = ['POST'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        const searchResults = await this.search(request.data);
        const items = await Zotero.Items.getAsync(searchResults);
        const js = items.map((item: any)=>this.toJSON(item))
        return [200, 'application/json', JSON.stringify(js)];
    }
    public toJSON(inp: any) {
        const item = Object.assign(inp.toJSON());
        if (Zotero.BetterBibTeX !== undefined) {
            const citekey = Zotero.BetterBibTeX.KeyManager.get(inp.itemID)
            if (citekey) {
                item['citationKey'] = citekey.citationKey
            }
        }
        return item
    }
    private search(conditions: any[]) {
        const s = new Zotero.Search();
        s.libraryID = Zotero.Libraries.userLibraryID;

        conditions.forEach(({ condition, operator = 'contains', value, required = true}) => {
            s.addCondition(condition, operator, value, required)
        });

        return s.search();
    }
}
