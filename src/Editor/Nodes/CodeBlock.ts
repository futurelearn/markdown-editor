import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { toggleBlockType } from '../utils';

const TYPE = schema.nodes.code_block;
const PARAGRAPH_TYPE = schema.nodes.paragraph;

const rules = [textblockTypeInputRule(/^(```|~~~)$/, TYPE)];

export const command = toggleBlockType(TYPE, PARAGRAPH_TYPE);

export const toolbarItem = {
  name: TYPE.name,
  icon: 'CodeBlock',
  command,
  type: TYPE,
};

export default [inputRules({ rules })];
