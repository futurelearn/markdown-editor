import { MenuItem } from '../types';
import { toolbarItems as markToolbarItems } from '../Editor/Marks';
import { toolbarItems as nodeToolbarItems } from '../Editor/Nodes';
import { Schema } from 'prosemirror-model';

const menuItems = (schema: Schema) =>
  [...markToolbarItems(schema), ...nodeToolbarItems(schema)] as MenuItem[];

export default menuItems;
