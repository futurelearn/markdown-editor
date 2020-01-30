import { MenuItemInterface } from './MenuItemInterface';
import { Schema } from 'prosemirror-model';
declare const menuItems: (schema: Schema<any, any>) => MenuItemInterface[];
export default menuItems;
