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
    return toggleBlockType(this._type, this.paragraphType, this.schema);
  }

  get rules() {
    return [textblockTypeInputRule(/^(```|~~~)$/, this._type)];
  }
}

export default CodeBlock;
