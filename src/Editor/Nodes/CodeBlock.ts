import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { toggleBlockType } from '../utils';
import Node from './Node';

class CodeBlock extends Node {
  get name() {
    return 'code_block';
  }

  get icon() {
    return 'CodeBlock';
  }

  get command() {
    return toggleBlockType(this.type, this.paragraphType);
  }

  get rules() {
    return [textblockTypeInputRule(/^(```|~~~)$/, this.type)];
  }
}

export default CodeBlock;
