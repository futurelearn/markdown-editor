import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node, NodeType } from 'prosemirror-model';
import low from 'lowlight/lib/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findBlockNodes } from 'prosemirror-utils';
import { flattenDeep } from 'lodash';

//@ts-ignore
import javascript from 'highlight.js/lib/languages/javascript';
//@ts-ignore
import python from 'highlight.js/lib/languages/python';
//@ts-ignore
import r from 'highlight.js/lib/languages/r';
//@ts-ignore
import css from 'highlight.js/lib/languages/css';
//@ts-ignore
import java from 'highlight.js/lib/languages/java';

interface LanguageInterface {
  language: string;
  pos: number;
  type: NodeType;
}

function getDecorations({ doc, name }: { doc: Node; name: string }) {
  const decorations: Decoration[] = [];
  const languages: LanguageInterface[] = [];
  const blocks = findBlockNodes(doc).filter(
    item => item.node.type.name === name
  );

  function parseNodes(nodes: lowlight.HastNode[], className = []) {
    return nodes.map(node => {
      const classes = [
        ...className,
        //@ts-ignore
        ...(node.properties ? node.properties.className : []),
      ];

      //@ts-ignore
      if (node.children) {
        //@ts-ignore
        return parseNodes(node.children, classes);
      }

      return {
        //@ts-ignore
        text: node.value,
        classes,
      };
    });
  }

  blocks.forEach(block => {
    let startPos = block.pos + 1;
    const { value: nodes, language, relevance } = low.highlightAuto(
      block.node.textContent
    );

    if (relevance > 1) {
      if (language && language !== block.node.attrs.params) {
        languages.push({ language, pos: block.pos, type: block.node.type });
      }

      flattenDeep(parseNodes(nodes))
        .map(node => {
          const from = startPos;
          const to = from + node.text.length;

          startPos = to;

          return {
            ...node,
            from,
            to,
          };
        })
        .forEach(node => {
          const decoration = Decoration.inline(node.from, node.to, {
            class: node.classes.join(' '),
          });
          decorations.push(decoration);
        });
    }
  });

  return { decorations: DecorationSet.create(doc, decorations), languages };
}

export const highlightPlugin = ({ name }: { name: string }) => {
  low.registerLanguage('javascript', javascript);
  low.registerLanguage('python', python);
  low.registerLanguage('r', r);
  low.registerLanguage('css', css);
  low.registerLanguage('java', java);
  return new Plugin({
    key: new PluginKey('highlight'),
    state: {
      init: (_, { doc }) => getDecorations({ doc, name }),
      apply: (transaction, decorationSet, oldState, state) => {
        const nodeName = state.selection.$head.parent.type.name;
        const previousNodeName = oldState.selection.$head.parent.type.name;

        if (
          transaction.docChanged &&
          [nodeName, previousNodeName].includes(name)
        ) {
          return getDecorations({ doc: transaction.doc, name });
        }

        const decorations = decorationSet.decorations || decorationSet;
        return decorations.map(transaction.mapping, transaction.doc);
      },
    },
    props: {
      decorations(this: Plugin, state) {
        const decorationSet = this.getState(state);
        return decorationSet.decorations || decorationSet;
      },
    },
    view: _view => {
      return {
        update: (view, prevState) => {
          const languages =
            //@ts-ignore
            prevState.highlight$ &&
            //@ts-ignore
            (prevState.highlight$.languages as LanguageInterface[]);
          if (languages && languages.length) {
            languages.forEach(lang => {
              const transaction = view.state.tr.setNodeMarkup(
                lang.pos,
                lang.type,
                { params: lang.language }
              );
              view.dispatch(transaction);
            });
          }
        },
      };
    },
  });
};
