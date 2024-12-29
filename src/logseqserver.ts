import Search from './endpoints/Search';
import AnnotationImage from './endpoints/AnnotationImage';
import Info from './endpoints/Info';
import Annotation from './endpoints/Annotation';

export default class LogseqServer {

    public start() {
        Zotero.Server.Endpoints['/logseq/search'] = Search
        Zotero.Server.Endpoints['/logseq/annotation/image'] = AnnotationImage
        Zotero.Server.Endpoints['/logseq/annotation'] = Annotation
        Zotero.Server.Endpoints['/logseq/info'] = Info
    }

}
