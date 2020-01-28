import { toggleMark } from 'prosemirror-commands';
import { markInputRule } from '../utils';
import Mark from './Mark';

class Emphasis extends Mark {
  get name() {
    return 'em';
  }

  get icon() {
    return 'Italic';
  }

  get shortcuts() {
    return {
      'Mod-i': toggleMark(this._type),
      'Mod-I': toggleMark(this._type),
    }
  }

  get rules() {
    return [
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, this._type),
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, this._type),
    ]
  }

  get command() {
    return toggleMark(this._type);
  }
}

export default Emphasis;
