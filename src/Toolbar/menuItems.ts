import { MenuItemInterface } from './MenuItemInterface';
import { toolbarItems as markToolbarItems } from '../Editor/Marks';
import { Schema } from 'prosemirror-model';

const menuItems = (schema: Schema) =>
  [
    ...markToolbarItems(schema),
  ] as MenuItemInterface[];

export default menuItems;
