import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { toggleList } from '../utils';

const BULLET_LIST_TYPE = schema.nodes.bullet_list;
const ORDERED_LIST_TYPE = schema.nodes.ordered_list;
const LIST_ITEM = schema.nodes.list_item;

const bulletListRules = [wrappingInputRule(/^\s*([-+*])\s$/, BULLET_LIST_TYPE)];

const orderedListRules = [
  wrappingInputRule(
    /^(\d+)\.\s$/,
    ORDERED_LIST_TYPE,
    match => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order === +match[1]
  ),
];

export const bulletListToolbarItem = {
  name: BULLET_LIST_TYPE.name,
  icon: 'UnorderedList',
  command: toggleList(BULLET_LIST_TYPE, LIST_ITEM),
  type: BULLET_LIST_TYPE,
};

export const orderedListToolbarItem = {
  name: ORDERED_LIST_TYPE.name,
  icon: 'OrderedList',
  command: toggleList(ORDERED_LIST_TYPE, LIST_ITEM),
  type: ORDERED_LIST_TYPE,
};

export default [
  inputRules({ rules: [...bulletListRules, ...orderedListRules] }),
];
