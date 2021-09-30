import { Plugin } from 'prosemirror-state';
import { MarkdownSchema } from '../markdown';
export declare const pastePlugin: (schema: MarkdownSchema, onError: (errors: string) => any) => Plugin<any, any>;
