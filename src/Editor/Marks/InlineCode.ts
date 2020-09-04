import { toggleMark } from 'prosemirror-commands';
import { markInputRule } from '../utils';
import Mark from './Mark';

class InlineCode extends Mark {
  get name() {
    return 'code';
  }

  get label() {
    return 'Toggle code';
  }

  get icon() {
    return 'Code';
  }

  get shortcuts() {
    return {
      'Mod-`': toggleMark(this.type),
    };
  }

  get rules() {
    return [markInputRule(/(?:`)([^`]+)(?:`)$/, this.type)];
  }

  get command() {
    return toggleMark(this.type);
  }
}

export default InlineCode;
