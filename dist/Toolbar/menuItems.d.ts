import { MenuItem } from '../types';
import { Schema } from 'prosemirror-model';
declare const menuItems: (schema: Schema<any, any>) => MenuItem[];
export default menuItems;
