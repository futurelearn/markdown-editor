import Strong from './Strong';
import Emphasis from './Emphasis';
import InlineCode from './InlineCode';
import Link from './Link';
import { flatMap, compact } from 'lodash';
import { Schema } from 'prosemirror-model';

const MARKS = [Strong, Emphasis, InlineCode, Link];

export const plugins = (schema: Schema) => {
  return flatMap(MARKS, Mark => new Mark(schema).getPlugins());
}

export const toolbarItems = (schema: Schema) => {
  return compact(MARKS.map(Mark => new Mark(schema).getToolbarItem()));
}
