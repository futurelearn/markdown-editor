import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { schema } from '../markdown';
import { toggleBlockType } from '../utils';

const TYPE = schema.nodes.heading;
const PARAGRAPH_TYPE = schema.nodes.paragraph;
const LEVELS = [1, 2, 3, 4, 5, 6];

const rules = LEVELS.map(l =>
  textblockTypeInputRule(new RegExp(`^(#{1,${l}})\\s$`), TYPE, () => ({
    level: l,
  }))
);

export const toolbarItem = {
  name: TYPE.name,
  icon: 'Heading',
  command: toggleBlockType(TYPE, PARAGRAPH_TYPE),
  type: TYPE,
};

export default [inputRules({ rules })];
