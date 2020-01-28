import { toggleMark } from 'prosemirror-commands';
import { markInputRule } from '../utils';
import Mark from './Mark';

class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get icon() {
    return 'Bold';
  }

  get command() {
    return toggleMark(this._type);
  }

  get shortcuts() {
    return {
      'Mod-b': toggleMark(this._type),
      'Mod-B': toggleMark(this._type),
    };
  }

  get rules() {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this._type)];
  }
}

export default Strong;
