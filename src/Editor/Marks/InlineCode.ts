import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { markInputRule } from '../utils';

const TYPE = schema.marks.code;

const shortcuts = {
  'Mod-`': toggleMark(TYPE),
};

const rules = [markInputRule(/(?:`)([^`]+)(?:`)$/, TYPE)];

export const toolbarItem = {
  name: TYPE.name,
  icon: 'Code',
  command: toggleMark(TYPE),
  type: TYPE,
};

export default [keymap(shortcuts), inputRules({ rules })];
