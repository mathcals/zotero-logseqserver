import EndpointInterface from '../types/EndpointInterface';

export default class Info implements EndpointInterface {
    permitBookmarklet = false;
    supportedMethods = ['POST'];
    supportedDataTypes = ['application/json'];

    public async init(request: any) {
        const item = await this.getInfo(request.data);
        if (item === null) {
            return [404, 'application/json', JSON.stringify({})];
        } else {
            return [200, 'application/json', JSON.stringify(item)];
        }
    }
    async getInfo(citekey: string) {
        const search = new Zotero.Search()
        search.addCondition("citationKey", "is", citekey);
        const keys = await search.search();

        if (keys.length == 0) return null;
        const items = await Zotero.Items.getAsync([keys[0]]);
        return items[0];
    }
}
