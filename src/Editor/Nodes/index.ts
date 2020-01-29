import Blockquote from './Blockquote';
import Heading from './Heading';
import { flatMap, compact } from 'lodash';
import { Schema } from 'prosemirror-model';

const NODES = [Blockquote, Heading];

export const plugins = (schema: Schema) => {
  return flatMap(NODES, Node => new Node(schema).getPlugins());
};

export const toolbarItems = (schema: Schema) => {
  return compact(NODES.map(Node => new Node(schema).getToolbarItem()));
};
