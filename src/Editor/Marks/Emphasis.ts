import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { markInputRule } from '../utils';

const TYPE = schema.marks.em;

const shortcuts = {
  'Mod-i': toggleMark(TYPE),
  'Mod-I': toggleMark(TYPE),
};

const rules = [
  markInputRule(/(?:^|[^_])(_([^_]+)_)$/, TYPE),
  markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, TYPE),
];

export const toolbarItem = {
  name: TYPE.name,
  icon: 'Italic',
  command: toggleMark(TYPE),
  type: TYPE,
};

export default [keymap(shortcuts), inputRules({ rules })];
