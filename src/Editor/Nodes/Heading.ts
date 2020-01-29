import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { toggleBlockType } from '../utils';
import Node from './Node';

const LEVELS = [1, 2, 3, 4, 5, 6];

class Heading extends Node {
  get name() {
    return 'heading';
  }

  get icon() {
    return 'Heading';
  }

  get command() {
    return toggleBlockType(this.type, this.paragraphType, this.schema);
  }

  get rules() {
    return LEVELS.map(l =>
      textblockTypeInputRule(new RegExp(`^(#{1,${l}})\\s$`), this.type, () => ({
        level: l,
      }))
    );
  }
}

export default Heading;
