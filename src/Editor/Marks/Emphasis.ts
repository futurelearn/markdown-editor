import { toggleMark } from 'prosemirror-commands';
import { markInputRule } from '../utils';
import Mark from './Mark';

class Emphasis extends Mark {
  get name() {
    return 'em';
  }

  get label() {
    return 'Toggle emphasis';
  }

  get icon() {
    return 'Italic';
  }

  get shortcuts() {
    return {
      'Mod-i': toggleMark(this.type),
      'Mod-I': toggleMark(this.type),
    };
  }

  get rules() {
    return [
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, this.type),
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, this.type),
    ];
  }

  get command() {
    return toggleMark(this.type);
  }
}

export default Emphasis;
