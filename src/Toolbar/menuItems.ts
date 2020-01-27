import { MenuItemInterface } from './MenuItemInterface';
import { toolbarItem as strongToolbarItem } from '../Editor/Marks/Strong';
import { toolbarItem as headingToolbarItem } from '../Editor/Nodes/Heading';
import { toolbarItem as emphasisToolbarItem } from '../Editor/Marks/Emphasis';
import { toolbarItem as inlineCodeToolbarItem } from '../Editor/Marks/InlineCode';
import { toolbarItem as blockquoteToolbarItem } from '../Editor/Nodes/Blockquote';
import {
  bulletListToolbarItem,
  orderedListToolbarItem,
} from '../Editor/Nodes/List';
import {
  toolbarItem as codeBlockToolbarItem
} from '../Editor/Nodes/CodeBlock';

const menuItems: MenuItemInterface[] = [
  strongToolbarItem,
  emphasisToolbarItem,
  headingToolbarItem,
  blockquoteToolbarItem,
  bulletListToolbarItem,
  orderedListToolbarItem,
  inlineCodeToolbarItem,
  codeBlockToolbarItem,
];

export default menuItems;
