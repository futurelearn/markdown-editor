import { linkInputRule, markdownLinkInputRule } from '../utils';
import Mark from './Mark';

const URL_REGEX = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*))\s$/g;
const MARKDOWN_URL_REGX = /\[(.+)\]\((https?[^ ]+)(?: "(.+)")?\)$/;

class Link extends Mark {
  get name() {
    return 'link';
  }

  get rules() {
    return [
      linkInputRule(URL_REGEX, this._type),
      markdownLinkInputRule(MARKDOWN_URL_REGX, this._type),
    ]
  }

  get inToolbar() {
    return false;
  }
}

export default Link;
