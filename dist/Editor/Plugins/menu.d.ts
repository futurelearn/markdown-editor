import { MenuItemInterface } from '../../Toolbar/MenuItemInterface';
import { Plugin } from 'prosemirror-state';
export declare const menuPlugin: (items: MenuItemInterface[], onUpdate: (items: string[]) => any) => Plugin<any, any>;
