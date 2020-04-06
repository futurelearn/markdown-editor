import { Plugin } from 'prosemirror-state';
import { ImageUploadEndpoint } from 'types';
export declare const imageDropPlugin: (endpoint: ImageUploadEndpoint, onError: (errors: string) => any) => Plugin<any, any>;
