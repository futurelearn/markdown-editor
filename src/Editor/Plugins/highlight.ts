import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { Language } from '../../types';
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

function getDecorations({ doc, name }: { doc: Node; name: string }) {
  const decorations: Decoration[] = [];
  const languages: Language[] = [];
  const blocks = findBlockNodes(doc).filter(
    item => item.node.type.name === name
  );

  // @ts-ignore
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
          // @ts-ignore
          const to = from + node.text.length;

          startPos = to;

          return {
            // @ts-ignore
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
  const key = new PluginKey('highlight');
  return new Plugin({
    key,
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
          const highlight = key.get(prevState);
          if (highlight) {
            const { languages } = highlight.getState(view.state) as {
              languages: Language[];
            };
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
          }
        },
      };
    },
  });
};
