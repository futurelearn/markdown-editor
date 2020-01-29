import Strong from './Strong';
import Emphasis from './Emphasis';
import { flatMap, compact } from 'lodash';
import { Schema } from 'prosemirror-model';

const MARKS = [Strong, Emphasis];

export const plugins = (schema: Schema) => {
  return flatMap(MARKS, Mark => new Mark(schema).getPlugins());
};

export const toolbarItems = (schema: Schema) => {
  return compact(MARKS.map(Mark => new Mark(schema).getToolbarItem()));
};
