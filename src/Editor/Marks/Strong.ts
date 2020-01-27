import { keymap } from 'prosemirror-keymap';
import { toggleMark } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { markInputRule } from '../utils';

const TYPE = schema.marks.strong;

const shortcuts = {
  'Mod-b': toggleMark(TYPE),
  'Mod-B': toggleMark(TYPE),
};

const rules = [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, TYPE)];
export const toolbarItem = {
  name: TYPE.name,
  icon: 'Bold',
  command: toggleMark(TYPE),
  type: TYPE,
};

export default [keymap(shortcuts), inputRules({ rules })];
