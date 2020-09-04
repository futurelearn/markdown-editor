import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleWrap } from '../utils';
import Node from './Node';

class Blockquote extends Node {
  get name() {
    return 'blockquote';
  }

  get label() {
    return 'Toggle block quote';
  }

  get icon() {
    return 'Quote';
  }

  get command() {
    return toggleWrap(this.type);
  }

  get rules() {
    return [wrappingInputRule(/^\s*>\s$/, this.type)];
  }
}

export default Blockquote;
