import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { toggleWrap } from '../utils';

const TYPE = schema.nodes.blockquote;

const rules = [wrappingInputRule(/^\s*>\s$/, TYPE)];

export const toolbarItem = {
  name: TYPE.name,
  icon: 'Quote',
  command: toggleWrap(TYPE),
  type: TYPE,
};

export default [inputRules({ rules })];
