import {
  schema as initialSchema,
  defaultMarkdownSerializer as initialDefaultMarkdownSerializer,
  MarkdownParser,
} from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';
import { omit } from 'lodash';
import markdownit from 'markdown-it/lib';

interface MarkdownSchema extends Schema {
  disabledNodes: string[];
  disabledMarks: string[];
}

declare module 'prosemirror-markdown' {
  let schema: MarkdownSchema;
}

const IGNORED_NODES = ['horizontal_rule', 'hard_break'];
const MARKDOWN_IT_RULES: { [token: string]: string} = {
  code: 'backticks',
  heading: 'heading',
}

const setupSchema = ({ disabledMarks = [], disabledNodes = [] }: { disabledMarks?: string[], disabledNodes?: string[] }) => {
  initialSchema.nodes = omit(initialSchema.nodes, [...IGNORED_NODES, ...disabledNodes]);
  initialSchema.marks = omit(initialSchema.marks, disabledMarks);
  //@ts-ignore
  initialSchema.nodes.code_block.isolating = true;
  initialSchema.disabledNodes = disabledNodes;
  initialSchema.disabledMarks = disabledMarks;
  return initialSchema;
};

const defaultMarkdownParser = (schema: MarkdownSchema) => {
  const disabledTokens = [...schema.disabledNodes, ...schema.disabledMarks];
  const tokens = omit({
    blockquote: {block: "blockquote"},
    paragraph: {block: "paragraph"},
    list_item: {block: "list_item"},
    bullet_list: {block: "bullet_list"},
    ordered_list: {block: "ordered_list", getAttrs: (tok: any) => ({order: +tok.attrGet("start") || 1})},
    heading: {block: "heading", getAttrs: (tok: any) => ({level: +tok.tag.slice(1)})},
    code_block: {block: "code_block"},
    fence: {block: "code_block", getAttrs: (tok: any) => ({params: tok.info || ""})},
    image: {node: "image", getAttrs: (tok: any) => ({
      src: tok.attrGet("src"),
      title: tok.attrGet("title") || null,
      alt: tok.children[0] && tok.children[0].content || null
    })},
    em: {mark: "em"},
    strong: {mark: "strong"},
    link: {mark: "link", getAttrs: (tok: any) => ({
      href: tok.attrGet("href"),
      title: tok.attrGet("title") || null
    })},
    code_inline: {mark: "code"}
  }, disabledTokens);

  const md = markdownit('commonmark', { html: false });
  md.disable(disabledTokens.map(t => MARKDOWN_IT_RULES[t]))

  //@ts-ignore
  return new MarkdownParser(schema, md, tokens);
};

const defaultMarkdownSerializer = (() => {
  initialDefaultMarkdownSerializer.nodes.code_block = (state, node) => {
    state.write('~~~' + (node.attrs.params || '') + '\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('~~~');
    state.closeBlock(node);
  };
  return initialDefaultMarkdownSerializer;
})();

export { setupSchema, defaultMarkdownParser, defaultMarkdownSerializer };
