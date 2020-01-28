import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleWrap } from '../utils';
import Node from './Node';

class Blockquote extends Node {
  get name() {
    return 'blockquote';
  }

  get icon() {
    return 'Quote';
  }

  get command() {
    return toggleWrap(this._type);
  }

  get rules() {
    return [wrappingInputRule(/^\s*>\s$/, this._type)];
  }
}

export default Blockquote;
