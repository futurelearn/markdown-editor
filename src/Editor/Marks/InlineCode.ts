import { toggleMark } from 'prosemirror-commands';
import { markInputRule } from '../utils';
import Mark from './Mark';

class InlineCode extends Mark {
  get name() {
    return 'code';
  }

  get icon() {
    return 'Code';
  }

  get shortcuts() {
    return {
      'Mod-`': toggleMark(this._type),
    };
  }

  get rules() {
    return [markInputRule(/(?:`)([^`]+)(?:`)$/, this._type)];
  }

  get command() {
    return toggleMark(this._type);
  }
}

export default InlineCode;
