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

  get title() {
    return 'bold';
  }

  get command() {
    return toggleMark(this.type);
  }

  get shortcuts() {
    return {
      'Mod-b': toggleMark(this.type),
      'Mod-B': toggleMark(this.type),
    };
  }

  get rules() {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
  }
}

export default Strong;
