import EndpointInterface from '../types/EndpointInterface';
export default class AnnotationImage implements EndpointInterface {
    supportedMethods = ['GET'];
    supportedDataTypes = ['image/png'];
    permitBookmarklet = false;

    public async init(request: any) {
        const libraryID = Zotero.Server.Connector.getSaveTarget(true).library.libraryID;
        const key = request.searchParams.get('id');
        if (!this.validKey(key))
            return [404, 'application/json', JSON.stringify({error: 'Invalid key'})]
        const item = {libraryID, key};
        const res = Zotero.Annotations.getCacheImagePath(item);
        const contents = await Zotero.File.getBinaryContentsAsync(res);
        return [200, 'image/png', " ", {rawData: contents}];
    }
    validKey(key: string) {
        return  key.match(/^[A-Z0-9]+$/)
    }

}
