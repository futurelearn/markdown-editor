import { MenuItem } from '../../types';
import { Plugin } from 'prosemirror-state';
export declare const menuPlugin: (items: MenuItem[], onUpdate: (items: string[]) => any) => Plugin<any, any>;
