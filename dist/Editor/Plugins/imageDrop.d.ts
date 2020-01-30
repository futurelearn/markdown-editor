import { Plugin } from 'prosemirror-state';
export declare const imageDropPlugin: (endpoint: {
    url: string;
    csrfToken: string;
}, onError: (errors: string) => any) => Plugin<any, any>;
