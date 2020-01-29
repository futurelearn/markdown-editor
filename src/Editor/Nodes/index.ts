import Blockquote from './Blockquote';
import Heading from './Heading';
import BulletList from './BulletList';
import OrderedList from './OrderedList';
import CodeBlock from './CodeBlock';
import { flatMap, compact } from 'lodash';
import { Schema } from 'prosemirror-model';

const NODES = [Blockquote, Heading, BulletList, OrderedList, CodeBlock];

export const plugins = (schema: Schema) => {
  return flatMap(NODES, Node => new Node(schema).getPlugins());
};

export const toolbarItems = (schema: Schema) => {
  return compact(NODES.map(Node => new Node(schema).getToolbarItem()));
};
