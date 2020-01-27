import { inputRules } from 'prosemirror-inputrules';
import { linkInputRule, markdownLinkInputRule } from '../utils';
import { schema } from '../markdown';

const URL_REGEX = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*))\s$/g;
const MARKDOWN_URL_REGX = /\[(.+)\]\((https?[^ ]+)(?: "(.+)")?\)$/;
const TYPE = schema.marks.link;

const rules = [
  linkInputRule(URL_REGEX, TYPE),
  markdownLinkInputRule(MARKDOWN_URL_REGX, TYPE),
];

export default [inputRules({ rules })];
