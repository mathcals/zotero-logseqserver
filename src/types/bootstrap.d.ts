export {};

declare global {
    interface StartupArgs {
        id:any , version: any, resourceURI:any, rootURI:any
    }
    function startup(args: StartupArgs): void;
}