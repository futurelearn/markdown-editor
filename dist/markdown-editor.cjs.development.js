'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var prosemirrorView = require('prosemirror-view');
var prosemirrorState = require('prosemirror-state');
var prosemirrorMarkdown = require('prosemirror-markdown');
var lodash = require('lodash');
var markdownit = _interopDefault(require('markdown-it/lib'));
var prosemirrorKeymap = require('prosemirror-keymap');
var prosemirrorCommands = require('prosemirror-commands');
var prosemirrorHistory = require('prosemirror-history');
var prosemirrorSchemaList = require('prosemirror-schema-list');
var prosemirrorModel = require('prosemirror-model');
var prosemirrorInputrules = require('prosemirror-inputrules');
var prosemirrorUtils = require('prosemirror-utils');
var low = _interopDefault(require('lowlight/lib/core'));
var javascript = _interopDefault(require('highlight.js/lib/languages/javascript'));
var python = _interopDefault(require('highlight.js/lib/languages/python'));
var r = _interopDefault(require('highlight.js/lib/languages/r'));
var css = _interopDefault(require('highlight.js/lib/languages/css'));
var java = _interopDefault(require('highlight.js/lib/languages/java'));
var classNames = _interopDefault(require('classnames'));

var IGNORED_NODES = ['horizontal_rule', 'hard_break'];
var IGNORED_TOKENS = ['hr', 'hardbreak'];
var MARKDOWN_IT_RULES = {
  code: 'backticks',
  heading: 'heading',
  blockquote: 'blockquote',
  code_block: 'code',
  fence: 'fence',
  bullet_list: 'list',
  ordered_list: 'list',
  hr: 'hr',
  image: 'image',
  link: 'link'
};

var setupSchema = function setupSchema(_ref) {
  var _ref$disabledMarks = _ref.disabledMarks,
      disabledMarks = _ref$disabledMarks === void 0 ? [] : _ref$disabledMarks,
      _ref$disabledNodes = _ref.disabledNodes,
      disabledNodes = _ref$disabledNodes === void 0 ? [] : _ref$disabledNodes;

  if (disabledNodes.includes('code_block')) {
    disabledNodes.push('fence');
  } else {
    //@ts-ignore
    prosemirrorMarkdown.schema.nodes.code_block.isolating = true;
  }

  prosemirrorMarkdown.schema.nodes = lodash.omit(prosemirrorMarkdown.schema.nodes, [].concat(IGNORED_NODES, disabledNodes));
  prosemirrorMarkdown.schema.marks = lodash.omit(prosemirrorMarkdown.schema.marks, disabledMarks);
  prosemirrorMarkdown.schema.disabledNodes = disabledNodes;
  prosemirrorMarkdown.schema.disabledMarks = disabledMarks;
  return prosemirrorMarkdown.schema;
};

var defaultMarkdownParser = function defaultMarkdownParser(schema) {
  var disabledTokens = [].concat(IGNORED_TOKENS, schema.disabledNodes, schema.disabledMarks);
  var tokens = lodash.omit(prosemirrorMarkdown.defaultMarkdownParser.tokens, disabledTokens);
  var md = markdownit('commonmark', {
    html: false
  });
  var tokensToDisable = lodash.compact(disabledTokens.map(function (t) {
    return MARKDOWN_IT_RULES[t];
  }));
  md.disable(tokensToDisable); //@ts-ignore

  return new prosemirrorMarkdown.MarkdownParser(schema, md, tokens);
};

var defaultMarkdownSerializer = /*#__PURE__*/function () {
  prosemirrorMarkdown.defaultMarkdownSerializer.nodes.code_block = function (state, node) {
    state.write('~~~' + (node.attrs.params || '') + '\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('~~~');
    state.closeBlock(node);
  };

  return prosemirrorMarkdown.defaultMarkdownSerializer;
}();

var EDITOR_CLASS = 'rich-text-editor';
var editorPlugin = function editorPlugin(classes, placeholder) {
  return new prosemirrorState.Plugin({
    props: {
      attributes: {
        "class": classes.length ? EDITOR_CLASS + " " + classes : EDITOR_CLASS,
        'data-placeholder': placeholder
      }
    }
  });
};

var pastePlugin = function pastePlugin(schema, onError) {
  return new prosemirrorState.Plugin({
    props: {
      clipboardTextParser: function clipboardTextParser(text) {
        var fragment = defaultMarkdownParser(schema).parse(text).content;
        return prosemirrorModel.Slice.maxOpen(fragment);
      },
      transformPastedHTML: function transformPastedHTML(html) {
        if (html.includes('<img src')) {
          onError('Pasted content cannot contain images');
          return '';
        }

        return html;
      }
    }
  });
};

var getMarksBetween = function getMarksBetween(start, end, state) {
  var marks = [];
  state.doc.nodesBetween(start, end, function (node, pos) {
    marks = [].concat(marks, node.marks.map(function (mark) {
      return {
        start: pos,
        end: pos + node.nodeSize,
        mark: mark
      };
    }));
  });
  return marks;
};

var markInputRule = function markInputRule(regexp, markType, getAttrs) {
  return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
    var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    var tr = state.tr;
    var m = match.length - 1;
    var markEnd = end;
    var markStart = start;

    if (match[m]) {
      var matchStart = start + match[0].indexOf(match[m - 1]);
      var matchEnd = matchStart + match[m - 1].length - 1;
      var textStart = matchStart + match[m - 1].lastIndexOf(match[m]);
      var textEnd = textStart + match[m].length;
      var excludedMarks = getMarksBetween(start, end, state).filter(function (item) {
        return item.mark.type.excludes(markType);
      }).filter(function (item) {
        return item.end > matchStart;
      });

      if (excludedMarks.length) {
        return null;
      }

      if (textEnd < matchEnd) {
        tr["delete"](textEnd, matchEnd);
      }

      if (textStart > matchStart) {
        tr["delete"](matchStart, textStart);
      }

      markStart = matchStart;
      markEnd = markStart + match[m].length;
    }

    tr.addMark(markStart, markEnd, markType.create(attrs));
    tr.removeStoredMark(markType);
    return tr;
  });
};

var linkInputRule = function linkInputRule(regexp, markType) {
  return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
    var tr = state.tr.insertText(match[0], start, end);
    var mark = markType.create({
      href: match[1]
    });
    return tr.addMark(start, start + match[1].length, mark);
  });
};

var markdownLinkInputRule = function markdownLinkInputRule(regexp, markType) {
  return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
    var tr = state.tr.insertText(match[1], start, end);
    var mark = markType.create({
      href: match[2],
      title: match[3]
    });
    return tr.addMark(start, start + match[1].length, mark);
  });
};

var markIsActive = function markIsActive(state, type) {
  var _state$selection = state.selection,
      from = _state$selection.from,
      $from = _state$selection.$from,
      to = _state$selection.to,
      empty = _state$selection.empty;

  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }

  return !!state.doc.rangeHasMark(from, to, type);
};

var nodeIsActive = function nodeIsActive(state, type, attrs) {
  if (attrs === void 0) {
    attrs = {};
  }

  var predicate = function predicate(node) {
    return node.type === type;
  };

  var node = prosemirrorUtils.findSelectedNodeOfType(type)(state.selection) || prosemirrorUtils.findParentNode(predicate)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return {
      isActive: !!node,
      node: node === null || node === void 0 ? void 0 : node.node
    };
  }

  return {
    isActive: node.node.hasMarkup(type, attrs),
    node: node.node
  };
};

var toggleBlockType = function toggleBlockType(type, toggletype, schema, attrs) {
  if (attrs === void 0) {
    attrs = {};
  }

  return function (state, dispatch) {
    var _nodeIsActive = nodeIsActive(state, type, attrs),
        isActive = _nodeIsActive.isActive,
        node = _nodeIsActive.node;

    if (isActive) {
      if (type === schema.nodes.code_block && (node === null || node === void 0 ? void 0 : node.textContent.length)) {
        return prosemirrorCommands.exitCode(state, dispatch);
      }

      return prosemirrorCommands.setBlockType(toggletype)(state, dispatch);
    }

    return prosemirrorCommands.setBlockType(type, attrs)(state, dispatch);
  };
};

var toggleWrap = function toggleWrap(type) {
  return function (state, dispatch) {
    var _nodeIsActive = nodeIsActive(state, type),
        isActive = _nodeIsActive.isActive;

    if (isActive) {
      return prosemirrorCommands.lift(state, dispatch);
    }

    return prosemirrorCommands.wrapIn(type)(state, dispatch);
  };
};

var isList = function isList(node, schema) {
  return node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list || node.type === schema.nodes.todo_list;
};

var toggleList = function toggleList(listType, itemType) {
  return function (state, dispatch) {
    var schema = state.schema,
        selection = state.selection;
    var $from = selection.$from,
        $to = selection.$to;
    var range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    var parentList = prosemirrorUtils.findParentNode(function (node) {
      return isList(node, schema);
    })(selection);

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return prosemirrorSchemaList.liftListItem(itemType)(state, dispatch);
      }

      if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
        var tr = state.tr;
        tr.setNodeMarkup(parentList.pos, listType);

        if (dispatch) {
          dispatch(tr);
        }

        return false;
      }
    }

    return prosemirrorSchemaList.wrapInList(listType)(state, dispatch);
  };
};

var Menu = /*#__PURE__*/function () {
  function Menu(items, editorView, onUpdate) {
    this.items = items;
    this.editorView = editorView;
    this.onUpdate = onUpdate;
  }

  var _proto = Menu.prototype;

  _proto.markActive = function markActive(type) {
    var state = this.editorView.state;

    if (type instanceof prosemirrorModel.NodeType) {
      return nodeIsActive(state, type).isActive;
    }

    return markIsActive(state, type);
  };

  _proto.update = function update() {
    var _this = this;

    var activeItems = this.items.filter(function (item) {
      return _this.markActive(item.type);
    });

    if (activeItems.length) {
      this.onUpdate(activeItems.map(function (i) {
        return i.name;
      }));
    } else {
      this.onUpdate([]);
    }
  };

  _proto.destroy = function destroy() {
    this.onUpdate([]);
  };

  return Menu;
}();

var menuPlugin = function menuPlugin(items, onUpdate) {
  return new prosemirrorState.Plugin({
    view: function view(editorView) {
      return new Menu(items, editorView, onUpdate);
    }
  });
};

var placeholderPlugin = /*#__PURE__*/new prosemirrorState.Plugin({
  state: {
    init: function init() {
      return prosemirrorView.DecorationSet.empty;
    },
    apply: function apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc); // See if the transaction adds or removes any placeholders

      var action = tr.getMeta(this);

      if (action && action.add) {
        var widget = document.createElement('div');
        widget.className = 'image__placeholder';
        var loader = document.createElement('div');
        loader.className = 'loader';
        widget.appendChild(loader);
        var deco = prosemirrorView.Decoration.widget(action.add.pos, widget, {
          id: action.add.id
        });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(set.find(undefined, undefined, function (spec) {
          return spec.id === action.remove.id;
        }));
      }

      return set;
    }
  },
  props: {
    decorations: function decorations(state) {
      return this.getState(state);
    }
  }
});
var findPlaceholder = function findPlaceholder(state, id) {
  var decos = placeholderPlugin.getState(state);
  var found = decos.find(undefined, undefined, function (spec) {
    return spec.id === id;
  });
  return found.length ? found[0].from : null;
};

var fileUpload = function fileUpload(view, images, endpoint, position, onError) {
  var id = {};
  var confirmResult = window.confirm('I am authorised to use this content');

  if (!confirmResult) {
    return false;
  }

  var tr = view.state.tr;
  tr.setMeta(placeholderPlugin, {
    add: {
      id: id,
      pos: position
    }
  });
  tr.setSelection(tr.selection);
  view.dispatch(tr);
  var schema = view.state.schema;
  images.forEach(function (image) {
    var pos = findPlaceholder(view.state, id);
    if (!pos) return;
    var formData = new FormData();
    formData.append('image', image);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', endpoint.url, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', endpoint.csrfToken);

    xhr.onerror = function () {
      var transaction = view.state.tr.setMeta(placeholderPlugin, {
        remove: {
          id: id
        }
      });
      onError('Sorry something went wrong');
      view.dispatch(transaction);
    };

    xhr.onload = function () {
      var transaction;
      var jsonBody;

      try {
        jsonBody = JSON.parse(xhr.response);
      } catch (_unused) {
        jsonBody = {
          errors: 'Sorry something went wrong'
        };
      }

      if ([200, 201].includes(xhr.status)) {
        var node = schema.nodes.image.create({
          src: jsonBody.data.url
        });
        transaction = view.state.tr.replaceWith(pos, pos, node).setMeta(placeholderPlugin, {
          remove: {
            id: id
          }
        });
      } else {
        transaction = view.state.tr.setMeta(placeholderPlugin, {
          remove: {
            id: id
          }
        });
        onError(jsonBody.errors);
      }

      view.dispatch(transaction);
    };

    xhr.send(formData);
  });
  return true;
};

var imageDropPlugin = function imageDropPlugin(endpoint, onError) {
  return new prosemirrorState.Plugin({
    props: {
      handleDOMEvents: {
        drop: function drop(view, event) {
          var dragEvent = event;
          if (!dragEvent.dataTransfer) return false;
          var hasFiles = dragEvent.dataTransfer.files && dragEvent.dataTransfer.files.length;

          if (!hasFiles) {
            return false;
          }

          var images = Array.from(dragEvent.dataTransfer.files).filter(function (file) {
            return /image/i.test(file.type);
          });

          if (images.length === 0) {
            return false;
          }

          event.preventDefault();
          var coordinates = view.posAtCoords({
            left: dragEvent.clientX,
            top: dragEvent.clientY
          });
          if (!coordinates) return false;
          return fileUpload(view, images, endpoint, coordinates.pos, onError);
        }
      }
    }
  });
};

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function getDecorations(_ref) {
  var doc = _ref.doc,
      name = _ref.name;
  var decorations = [];
  var languages = [];
  var blocks = prosemirrorUtils.findBlockNodes(doc).filter(function (item) {
    return item.node.type.name === name;
  });

  function parseNodes(nodes, className) {
    if (className === void 0) {
      className = [];
    }

    return nodes.map(function (node) {
      var classes = [].concat(className, node.properties ? node.properties.className : []); //@ts-ignore

      if (node.children) {
        //@ts-ignore
        return parseNodes(node.children, classes);
      }

      return {
        //@ts-ignore
        text: node.value,
        classes: classes
      };
    });
  }

  blocks.forEach(function (block) {
    var startPos = block.pos + 1;

    var _low$highlightAuto = low.highlightAuto(block.node.textContent),
        nodes = _low$highlightAuto.value,
        language = _low$highlightAuto.language,
        relevance = _low$highlightAuto.relevance;

    if (relevance > 1) {
      if (language && language !== block.node.attrs.params) {
        languages.push({
          language: language,
          pos: block.pos,
          type: block.node.type
        });
      }

      lodash.flattenDeep(parseNodes(nodes)).map(function (node) {
        var from = startPos;
        var to = from + node.text.length;
        startPos = to;
        return _extends({}, node, {
          from: from,
          to: to
        });
      }).forEach(function (node) {
        var decoration = prosemirrorView.Decoration.inline(node.from, node.to, {
          "class": node.classes.join(' ')
        });
        decorations.push(decoration);
      });
    }
  });
  return {
    decorations: prosemirrorView.DecorationSet.create(doc, decorations),
    languages: languages
  };
}

var highlightPlugin = function highlightPlugin(_ref2) {
  var name = _ref2.name;
  low.registerLanguage('javascript', javascript);
  low.registerLanguage('python', python);
  low.registerLanguage('r', r);
  low.registerLanguage('css', css);
  low.registerLanguage('java', java);
  return new prosemirrorState.Plugin({
    key: new prosemirrorState.PluginKey('highlight'),
    state: {
      init: function init(_, _ref3) {
        var doc = _ref3.doc;
        return getDecorations({
          doc: doc,
          name: name
        });
      },
      apply: function apply(transaction, decorationSet, oldState, state) {
        var nodeName = state.selection.$head.parent.type.name;
        var previousNodeName = oldState.selection.$head.parent.type.name;

        if (transaction.docChanged && [nodeName, previousNodeName].includes(name)) {
          return getDecorations({
            doc: transaction.doc,
            name: name
          });
        }

        var decorations = decorationSet.decorations || decorationSet;
        return decorations.map(transaction.mapping, transaction.doc);
      }
    },
    props: {
      decorations: function decorations(state) {
        var decorationSet = this.getState(state);
        return decorationSet.decorations || decorationSet;
      }
    },
    view: function view(_view) {
      return {
        update: function update(view, prevState) {
          var languages = //@ts-ignore
          prevState.highlight$ && //@ts-ignore
          prevState.highlight$.languages;

          if (languages && languages.length) {
            languages.forEach(function (lang) {
              var transaction = view.state.tr.setNodeMarkup(lang.pos, lang.type, {
                params: lang.language
              });
              view.dispatch(transaction);
            });
          }
        }
      };
    }
  });
};

var BaseType = /*#__PURE__*/function () {
  function BaseType(schema) {
    this.schema = schema;
  }

  var _proto = BaseType.prototype;

  _proto.getPlugins = function getPlugins() {
    if (this._type) {
      return [prosemirrorKeymap.keymap(this.shortcuts), prosemirrorInputrules.inputRules({
        rules: this.rules
      })];
    }

    return [];
  };

  _proto.getToolbarItem = function getToolbarItem() {
    if (this._type && this.inToolbar && this.command) {
      return {
        name: this.name,
        icon: this.icon,
        command: this.command,
        type: this.type
      };
    }

    return null;
  };

  _createClass(BaseType, [{
    key: "name",
    get: function get() {
      return '';
    }
  }, {
    key: "icon",
    get: function get() {
      return '';
    }
  }, {
    key: "inToolbar",
    get: function get() {
      return true;
    }
  }, {
    key: "command",
    get: function get() {
      return function (_state, _dispatch) {};
    }
  }, {
    key: "shortcuts",
    get: function get() {
      return {};
    }
  }, {
    key: "rules",
    get: function get() {
      return [];
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "_type",
    get: function get() {
      return null;
    }
  }]);

  return BaseType;
}();

var Mark = /*#__PURE__*/function (_BaseType) {
  _inheritsLoose(Mark, _BaseType);

  function Mark() {
    return _BaseType.apply(this, arguments) || this;
  }

  _createClass(Mark, [{
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "_type",
    get: function get() {
      return this.schema.marks[this.name];
    }
  }]);

  return Mark;
}(BaseType);

var Strong = /*#__PURE__*/function (_Mark) {
  _inheritsLoose(Strong, _Mark);

  function Strong() {
    return _Mark.apply(this, arguments) || this;
  }

  _createClass(Strong, [{
    key: "name",
    get: function get() {
      return 'strong';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'Bold';
    }
  }, {
    key: "command",
    get: function get() {
      return prosemirrorCommands.toggleMark(this.type);
    }
  }, {
    key: "shortcuts",
    get: function get() {
      return {
        'Mod-b': prosemirrorCommands.toggleMark(this.type),
        'Mod-B': prosemirrorCommands.toggleMark(this.type)
      };
    }
  }, {
    key: "rules",
    get: function get() {
      return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
    }
  }]);

  return Strong;
}(Mark);

var Emphasis = /*#__PURE__*/function (_Mark) {
  _inheritsLoose(Emphasis, _Mark);

  function Emphasis() {
    return _Mark.apply(this, arguments) || this;
  }

  _createClass(Emphasis, [{
    key: "name",
    get: function get() {
      return 'em';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'Italic';
    }
  }, {
    key: "shortcuts",
    get: function get() {
      return {
        'Mod-i': prosemirrorCommands.toggleMark(this.type),
        'Mod-I': prosemirrorCommands.toggleMark(this.type)
      };
    }
  }, {
    key: "rules",
    get: function get() {
      return [markInputRule(/(?:^|[^_])(_([^_]+)_)$/, this.type), markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, this.type)];
    }
  }, {
    key: "command",
    get: function get() {
      return prosemirrorCommands.toggleMark(this.type);
    }
  }]);

  return Emphasis;
}(Mark);

var InlineCode = /*#__PURE__*/function (_Mark) {
  _inheritsLoose(InlineCode, _Mark);

  function InlineCode() {
    return _Mark.apply(this, arguments) || this;
  }

  _createClass(InlineCode, [{
    key: "name",
    get: function get() {
      return 'code';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'Code';
    }
  }, {
    key: "shortcuts",
    get: function get() {
      return {
        'Mod-`': prosemirrorCommands.toggleMark(this.type)
      };
    }
  }, {
    key: "rules",
    get: function get() {
      return [markInputRule(/(?:`)([^`]+)(?:`)$/, this.type)];
    }
  }, {
    key: "command",
    get: function get() {
      return prosemirrorCommands.toggleMark(this.type);
    }
  }]);

  return InlineCode;
}(Mark);

var URL_REGEX = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*))\s$/g;
var MARKDOWN_URL_REGX = /\[(.+)\]\((https?[^ ]+)(?: "(.+)")?\)$/;

var Link = /*#__PURE__*/function (_Mark) {
  _inheritsLoose(Link, _Mark);

  function Link() {
    return _Mark.apply(this, arguments) || this;
  }

  _createClass(Link, [{
    key: "name",
    get: function get() {
      return 'link';
    }
  }, {
    key: "rules",
    get: function get() {
      return [linkInputRule(URL_REGEX, this.type), markdownLinkInputRule(MARKDOWN_URL_REGX, this.type)];
    }
  }, {
    key: "inToolbar",
    get: function get() {
      return false;
    }
  }]);

  return Link;
}(Mark);

var MARKS = [Strong, Emphasis, InlineCode, Link];
var plugins = function plugins(schema) {
  return lodash.flatMap(MARKS, function (Mark) {
    return new Mark(schema).getPlugins();
  });
};
var toolbarItems = function toolbarItems(schema) {
  return lodash.compact(MARKS.map(function (Mark) {
    return new Mark(schema).getToolbarItem();
  }));
};

var Node = /*#__PURE__*/function (_BaseType) {
  _inheritsLoose(Node, _BaseType);

  function Node() {
    return _BaseType.apply(this, arguments) || this;
  }

  _createClass(Node, [{
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "_type",
    get: function get() {
      return this.schema.nodes[this.name];
    }
  }, {
    key: "paragraphType",
    get: function get() {
      return this.schema.nodes.paragraph;
    }
  }, {
    key: "listItemType",
    get: function get() {
      return this.schema.nodes.list_item;
    }
  }]);

  return Node;
}(BaseType);

var Blockquote = /*#__PURE__*/function (_Node) {
  _inheritsLoose(Blockquote, _Node);

  function Blockquote() {
    return _Node.apply(this, arguments) || this;
  }

  _createClass(Blockquote, [{
    key: "name",
    get: function get() {
      return 'blockquote';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'Quote';
    }
  }, {
    key: "command",
    get: function get() {
      return toggleWrap(this.type);
    }
  }, {
    key: "rules",
    get: function get() {
      return [prosemirrorInputrules.wrappingInputRule(/^\s*>\s$/, this.type)];
    }
  }]);

  return Blockquote;
}(Node);

var LEVELS = [1, 2, 3, 4, 5, 6];

var Heading = /*#__PURE__*/function (_Node) {
  _inheritsLoose(Heading, _Node);

  function Heading() {
    return _Node.apply(this, arguments) || this;
  }

  _createClass(Heading, [{
    key: "name",
    get: function get() {
      return 'heading';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'Heading';
    }
  }, {
    key: "command",
    get: function get() {
      return toggleBlockType(this.type, this.paragraphType, this.schema);
    }
  }, {
    key: "rules",
    get: function get() {
      var _this = this;

      return LEVELS.map(function (l) {
        return prosemirrorInputrules.textblockTypeInputRule(new RegExp("^(#{1," + l + "})\\s$"), _this.type, function () {
          return {
            level: l
          };
        });
      });
    }
  }]);

  return Heading;
}(Node);

var BulletList = /*#__PURE__*/function (_Node) {
  _inheritsLoose(BulletList, _Node);

  function BulletList() {
    return _Node.apply(this, arguments) || this;
  }

  _createClass(BulletList, [{
    key: "name",
    get: function get() {
      return 'bullet_list';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'UnorderedList';
    }
  }, {
    key: "command",
    get: function get() {
      return toggleList(this.type, this.listItemType);
    }
  }, {
    key: "rules",
    get: function get() {
      return [prosemirrorInputrules.wrappingInputRule(/^\s*([-+*])\s$/, this.type)];
    }
  }]);

  return BulletList;
}(Node);

var OrderedList = /*#__PURE__*/function (_Node) {
  _inheritsLoose(OrderedList, _Node);

  function OrderedList() {
    return _Node.apply(this, arguments) || this;
  }

  _createClass(OrderedList, [{
    key: "name",
    get: function get() {
      return 'ordered_list';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'OrderedList';
    }
  }, {
    key: "command",
    get: function get() {
      return toggleList(this.type, this.listItemType);
    }
  }, {
    key: "rules",
    get: function get() {
      return [prosemirrorInputrules.wrappingInputRule(/^(\d+)\.\s$/, this.type, function (match) {
        return {
          order: +match[1]
        };
      }, function (match, node) {
        return node.childCount + node.attrs.order === +match[1];
      })];
    }
  }]);

  return OrderedList;
}(Node);

var CodeBlock = /*#__PURE__*/function (_Node) {
  _inheritsLoose(CodeBlock, _Node);

  function CodeBlock() {
    return _Node.apply(this, arguments) || this;
  }

  _createClass(CodeBlock, [{
    key: "name",
    get: function get() {
      return 'code_block';
    }
  }, {
    key: "icon",
    get: function get() {
      return 'CodeBlock';
    }
  }, {
    key: "command",
    get: function get() {
      return toggleBlockType(this.type, this.paragraphType, this.schema);
    }
  }, {
    key: "rules",
    get: function get() {
      return [prosemirrorInputrules.textblockTypeInputRule(/^(```|~~~)$/, this.type)];
    }
  }]);

  return CodeBlock;
}(Node);

var NODES = [Blockquote, Heading, BulletList, OrderedList, CodeBlock];
var plugins$1 = function plugins(schema) {
  return lodash.flatMap(NODES, function (Node) {
    return new Node(schema).getPlugins();
  });
};
var toolbarItems$1 = function toolbarItems(schema) {
  return lodash.compact(NODES.map(function (Node) {
    return new Node(schema).getToolbarItem();
  }));
};

var menuItems = function menuItems(schema) {
  return [].concat(toolbarItems(schema), toolbarItems$1(schema));
};

var createEditorView = function createEditorView(_ref) {
  var node = _ref.node,
      value = _ref.value,
      onChange = _ref.onChange,
      classes = _ref.classes,
      placeholder = _ref.placeholder,
      onToolbarChange = _ref.onToolbarChange,
      imageUploadEndpoint = _ref.imageUploadEndpoint,
      disabledMarks = _ref.disabledMarks,
      disabledNodes = _ref.disabledNodes,
      onError = _ref.onError;
  var schema = setupSchema({
    disabledMarks: disabledMarks,
    disabledNodes: disabledNodes
  });
  var LIST_ITEM_TYPE = schema.nodes.list_item;

  var toggleBlockIfEmpty = function toggleBlockIfEmpty(state, dispatch) {
    var parent = state.selection.$from.parent;

    if ([schema.nodes.heading, schema.nodes.code_block].includes(parent.type)) {
      if (!parent.textContent.length) {
        prosemirrorCommands.setBlockType(schema.nodes.paragraph)(state, dispatch);
        return true;
      }
    }

    return false;
  };

  var plugins$2 = [prosemirrorHistory.history(), prosemirrorKeymap.keymap({
    'Mod-z': prosemirrorHistory.undo,
    'Mod-y': prosemirrorHistory.redo,
    Enter: prosemirrorSchemaList.splitListItem(LIST_ITEM_TYPE),
    Backspace: toggleBlockIfEmpty
  }), prosemirrorKeymap.keymap({
    'Shift-Enter': prosemirrorCommands.exitCode
  }), prosemirrorKeymap.keymap(prosemirrorCommands.baseKeymap), pastePlugin(schema, onError), menuPlugin(menuItems(schema), onToolbarChange)].concat(plugins(schema), plugins$1(schema), [editorPlugin(classes, placeholder)]);
  schema.nodes.code_block && plugins$2.push(highlightPlugin({
    name: schema.nodes.code_block.name
  }));
  imageUploadEndpoint && schema.nodes.image && plugins$2.push(placeholderPlugin, imageDropPlugin(imageUploadEndpoint, onError));
  var editorView = new prosemirrorView.EditorView(node, {
    state: prosemirrorState.EditorState.create({
      schema: schema,
      doc: defaultMarkdownParser(schema).parse(value),
      plugins: plugins$2
    }),
    dispatchTransaction: function dispatchTransaction(transation) {
      var newState = editorView.state.apply(transation);
      editorView.updateState(newState);
      onChange(defaultMarkdownSerializer.serialize(editorView.state.doc));
    }
  });
  return editorView;
};

var Bold = function Bold() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--bold",
    viewBox: "0 0 32 32"
  }, React__default.createElement("path", {
    d: "M24.2,17.4c-0.9-0.9-2-1.7-3.3-2.1c1.8-1,3.6-3,3.6-6.7c0-0.1,0.2-3.5-2.1-5.9C20.8,0.9,18.5,0,15.5,0H9v0H7\n  v32h0.8v0H16c0.1,0,0.1,0,0.2,0c1.5,0,5.3-0.1,7.8-2.6c1.5-1.5,2.3-3.6,2.3-6.1C26.3,22.8,26.4,19.8,24.2,17.4z M15.5,2\n  c2.4,0,4.2,0.6,5.4,1.9c1.7,1.8,1.6,4.4,1.6,4.5c0,2.6-1,4.3-3,5.3c-1.1,0.5-2.4,0.8-4,0.8H9V2H15.5z M24.2,23.1l0,0.1\n  c0,2-0.6,3.6-1.7,4.8c-2,2-5.5,2-6.6,2H9V16.5h6.8c3.2-0.1,5.5,0.7,6.9,2.2C24.4,20.6,24.2,23.1,24.2,23.1z"
  }));
};

var Code = function Code() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--code",
    viewBox: "0 0 32 32"
  }, React__default.createElement("polygon", {
    points: "13.1,6.7 11.6,5.3 1,16 11.7,26.7 13.1,25.3 3.8,16 "
  }), React__default.createElement("polygon", {
    points: "20.4,5.3 19,6.7 28.2,16 19,25.3 20.4,26.7 31,16 "
  }));
};

var CodeBlock$1 = function CodeBlock() {
  return React__default.createElement("svg", {
    viewBox: "0 0 32 32"
  }, React__default.createElement("path", {
    fill: "#3A343A",
    d: "M11.97,1.02L10.69,1v0C10.47,1,8.7,0.85,7.48,1.96c-0.6,0.55-0.92,1.31-0.92,2.2v9.66  c0,0.42-0.15,0.6-0.27,0.72C5.77,15.06,3.97,15,3.97,15v2c0,0,1.79-0.07,2.33,0.46c0.12,0.12,0.27,0.3,0.27,0.72v9.66  c0,0.89,0.32,1.65,0.92,2.2C8.7,31.15,10.47,31,10.69,31v0l1.28-0.02V29L10.69,29c-0.33,0.02-1.38,0-1.86-0.44  c-0.12-0.11-0.27-0.3-0.27-0.72v-9.66c0-0.87-0.31-1.63-0.9-2.18c0.58-0.55,0.9-1.31,0.9-2.18V4.16c0-0.42,0.14-0.61,0.27-0.72  C9.31,2.99,10.36,2.97,10.69,3v0L11.97,3V1.02z"
  }), React__default.createElement("path", {
    fill: "#3A343A",
    d: "M19.98,1.02L21.26,1v0c0.22,0,1.99-0.15,3.21,0.97c0.6,0.55,0.92,1.31,0.92,2.2v9.66  c0,0.42,0.15,0.6,0.27,0.72c0.52,0.52,2.33,0.46,2.33,0.46v2c0,0-1.79-0.07-2.33,0.46c-0.12,0.12-0.27,0.3-0.27,0.72v9.66  c0,0.89-0.32,1.65-0.92,2.2C23.25,31.15,21.49,31,21.26,31v0l-1.28-0.02V29L21.26,29c0.33,0.02,1.38,0,1.86-0.44  c0.12-0.11,0.27-0.3,0.27-0.72v-9.66c0-0.87,0.31-1.63,0.9-2.18c-0.58-0.55-0.9-1.31-0.9-2.18V4.16c0-0.42-0.14-0.61-0.27-0.72  C22.64,2.99,21.59,2.97,21.26,3v0L19.98,3V1.02z"
  }));
};

var Heading$1 = function Heading() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--heading",
    viewBox: "0 0 32 32"
  }, React__default.createElement("polygon", {
    points: "25,0 25,15 7,15 7,0 5,0 5,32 7,32 7,17 25,17 25,32 27,32 27,0 "
  }));
};

var Image = function Image() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--italic",
    viewBox: "0 0 32 32"
  }, React__default.createElement("circle", {
    cx: "21.5",
    cy: "11.5",
    r: "4.5"
  }), React__default.createElement("polygon", {
    points: "32,6 32,0 0,0 0,32 32,32 32,11 30,11 30,30 16,20 2,30 2,2 30,2 30,6"
  }));
};

var Italic = function Italic() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--italic",
    viewBox: "0 0 32 32"
  }, React__default.createElement("polygon", {
    points: "25.3,2 25.3,0 13.3,0 13.3,2 18.1,2 12.2,30 7,30 7,32 19,32 19,30 14.2,30 20.1,2 "
  }));
};

var OrderedList$1 = function OrderedList() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--ordered-list",
    viewBox: "0 0 32 32"
  }, React__default.createElement("rect", {
    x: "10",
    y: "3",
    width: "22",
    height: "2"
  }), React__default.createElement("rect", {
    x: "10",
    y: "15",
    width: "22",
    height: "2"
  }), React__default.createElement("rect", {
    x: "10",
    y: "27",
    width: "22",
    height: "2"
  }), React__default.createElement("path", {
    d: "M3.8,25.1c-1,0-1.3,0.8-1.3,0.8l-1.3-0.7c0,0,0.7-1.6,2.7-1.6c1.5,0,2.9,0.8,2.9,2.4c0,1.1-0.9,1.4-0.9,1.4\n    s1,0.4,1,1.7c0,1.6-1.4,2.4-2.9,2.4c-2.2,0-2.8-1.8-2.8-1.8l1.4-0.8c0,0,0.3,1.1,1.4,1.1c0.7,0,1-0.4,1-0.9c0-0.6-0.5-0.9-1.3-0.9\n    H3.3v-1.3h0.3c0.6,0,1.3-0.2,1.3-0.9C4.9,25.5,4.5,25.1,3.8,25.1z"
  }), React__default.createElement("path", {
    d: "M4.1,16C4.4,15.6,5,15,5,14.3c0-0.6-0.5-1.1-1.2-1.1c-1,0-1.3,1.1-1.3,1.1L1,13.8c0,0,0.6-2.3,2.8-2.3\n    c2,0,3,1.4,3,2.7c0,0.8-0.4,1.5-0.6,1.7L4.7,18h2.2v1.6H1.1L4.1,16z"
  }), React__default.createElement("path", {
    d: "M4.4,0.6H6v7.9H4.2V2.9L2.4,4.5l-1-1.3L4.4,0.6z"
  }));
};

var Quote = function Quote() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--quote",
    viewBox: "0 0 32 32"
  }, React__default.createElement("path", {
    d: "M11.1,26V15.9H5.6C6,12.3,8.3,9.5,12,9.5V5.8c-5.8,0-10.5,4.4-11,10.1l0,0V26H11.1z"
  }), React__default.createElement("path", {
    d: "M20.9,5.8v10.1h5.5c-0.5,3.6-2.7,6.4-6.4,6.4V26c5.8,0,10.5-4.4,11-10.1l0,0V5.8L20.9,5.8z"
  }));
};

var UnorderedList = function UnorderedList() {
  return React__default.createElement("svg", {
    className: "a-svg-icon a-svg-icon--unordered-list",
    viewBox: "0 0 32 32"
  }, React__default.createElement("circle", {
    cx: "2.5",
    cy: "4",
    r: "2.5"
  }), React__default.createElement("circle", {
    cx: "2.5",
    cy: "16",
    r: "2.5"
  }), React__default.createElement("circle", {
    cx: "2.5",
    cy: "28",
    r: "2.5"
  }), React__default.createElement("rect", {
    x: "8",
    y: "3",
    width: "24",
    height: "2"
  }), React__default.createElement("rect", {
    x: "8",
    y: "15",
    width: "24",
    height: "2"
  }), React__default.createElement("rect", {
    x: "8",
    y: "27",
    width: "24",
    height: "2"
  }));
};

var Icons = {
  Bold: Bold,
  Code: Code,
  CodeBlock: CodeBlock$1,
  Heading: Heading$1,
  Image: Image,
  Italic: Italic,
  OrderedList: OrderedList$1,
  Quote: Quote,
  UnorderedList: UnorderedList
};

var Item = function Item(_ref) {
  var item = _ref.item,
      _ref$item = _ref.item,
      icon = _ref$item.icon,
      name = _ref$item.name,
      isActive = _ref.isActive,
      _onClick = _ref.onClick;
  var Icon = Icons[icon];
  return React__default.createElement("button", {
    className: classNames('item', {
      'item--active': isActive
    }),
    "data-item": name,
    onClick: function onClick() {
      return _onClick(item);
    },
    type: "button"
  }, React__default.createElement(Icon, null));
};

var ImageUpload = function ImageUpload(_ref) {
  var editor = _ref.editor,
      imageUploadEndpoint = _ref.imageUploadEndpoint,
      onError = _ref.onError;

  var onImageUpload = function onImageUpload(e) {
    if (!imageUploadEndpoint) return;
    if (!editor) return;
    if (!e.target) return;
    var target = e.target;
    if (!target.files) return;
    e.preventDefault();
    fileUpload(editor, Array.from(target.files), imageUploadEndpoint, editor.state.tr.selection.from, onError);
    editor.focus();
    target.value = '';
  };

  return React__default.createElement("div", {
    className: "fileUploadWrapper"
  }, React__default.createElement("input", {
    type: "file",
    accept: ".jpg,.jpeg,.png,.gif",
    onChange: onImageUpload
  }), React__default.createElement("button", {
    "data-item": "image",
    className: "item fileUploadWrapper--button"
  }, React__default.createElement(Icons.Image, null)));
};

var Toolbar = function Toolbar(_ref) {
  var onClick = _ref.onClick,
      activeOptions = _ref.activeOptions,
      editor = _ref.editor,
      imageUploadEndpoint = _ref.imageUploadEndpoint,
      _ref$disabledItems = _ref.disabledItems,
      disabledItems = _ref$disabledItems === void 0 ? [] : _ref$disabledItems,
      onError = _ref.onError;
  var menuItemsToRender = React.useMemo(function () {
    return menuItems(editor.state.schema).filter(function (i) {
      return !disabledItems.includes(i.name);
    });
  }, [disabledItems, editor.state.schema]);
  return React__default.createElement("div", {
    className: "toolbar"
  }, menuItemsToRender.map(function (item) {
    return React__default.createElement(Item, {
      key: item.name,
      item: item,
      onClick: onClick,
      isActive: activeOptions.includes(item.name)
    });
  }), !disabledItems.includes('image') && React__default.createElement(ImageUpload, {
    editor: editor,
    imageUploadEndpoint: imageUploadEndpoint,
    onError: onError
  }));
};

var Toolbar$1 = /*#__PURE__*/React__default.memo(Toolbar);

var ContextualHelp = function ContextualHelp(_ref) {
  var activeOptions = _ref.activeOptions;
  var helpText = {
    code_block: 'Hold down shift and press enter to exit the code block'
  };
  return React__default.createElement("p", null, activeOptions.map(function (o) {
    return helpText[o];
  }));
};

var MarkDownEditor = function MarkDownEditor(_ref) {
  var id = _ref.id,
      name = _ref.name,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      _ref$value = _ref.value,
      value = _ref$value === void 0 ? '' : _ref$value,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? 'Enter text' : _ref$placeholder,
      _ref$classes = _ref.classes,
      classes = _ref$classes === void 0 ? '' : _ref$classes,
      imageUploadEndpoint = _ref.imageUploadEndpoint,
      _ref$onError = _ref.onError,
      onError = _ref$onError === void 0 ? function () {} : _ref$onError,
      _ref$disabledMarks = _ref.disabledMarks,
      disabledMarks = _ref$disabledMarks === void 0 ? [] : _ref$disabledMarks,
      _ref$disabledNodes = _ref.disabledNodes,
      disabledNodes = _ref$disabledNodes === void 0 ? [] : _ref$disabledNodes;
  var editorRef = React.useRef(null);

  var _useState = React.useState(null),
      editor = _useState[0],
      setEditor = _useState[1];

  var _useState2 = React.useState(value),
      markdownValue = _useState2[0],
      setMarkdownValue = _useState2[1];

  var _useState3 = React.useState([]),
      activeOptions = _useState3[0],
      setActiveOptions = _useState3[1];

  var disabledItems = React.useRef([].concat(disabledMarks, disabledNodes));
  var activeOptionsRef = React.useRef(activeOptions);

  var onInputChange = function onInputChange(md) {
    setMarkdownValue(md);
    onChange(md);
  };

  var onToolbarChange = function onToolbarChange(options) {
    if (JSON.stringify(options) !== JSON.stringify(activeOptionsRef.current)) {
      setActiveOptions(options);
    }
  };

  var initEditor = function initEditor() {
    if (editorRef.current) {
      var editorView = createEditorView({
        node: editorRef.current,
        value: value,
        onChange: onInputChange,
        classes: classes,
        placeholder: placeholder,
        onToolbarChange: onToolbarChange,
        imageUploadEndpoint: imageUploadEndpoint,
        onError: onError,
        disabledNodes: disabledNodes,
        disabledMarks: disabledMarks
      });
      setEditor(editorView);
    }
  };

  var onToolbarClick = React.useCallback(function (_ref2) {
    var command = _ref2.command;

    if (editor) {
      editor.focus();
      command(editor.state, editor.dispatch, editor);
    }
  }, [editor]);
  React.useEffect(function () {
    activeOptionsRef.current = activeOptions;
  }, [activeOptions]);
  React.useEffect(function () {
    if (value !== markdownValue && editor) {
      editor.destroy();
      initEditor();
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(function () {
    initEditor();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return React__default.createElement(React__default.Fragment, null, editor && React__default.createElement(Toolbar$1, {
    activeOptions: activeOptions,
    onClick: onToolbarClick,
    editor: editor,
    disabledItems: disabledItems.current,
    imageUploadEndpoint: imageUploadEndpoint,
    onError: onError
  }), React__default.createElement("div", {
    id: id,
    className: classNames({
      hasPlaceholder: !markdownValue.length
    }),
    ref: editorRef
  }), React__default.createElement(ContextualHelp, {
    activeOptions: activeOptions
  }), React__default.createElement("input", {
    type: "hidden",
    value: markdownValue,
    onChange: function onChange() {},
    name: name
  }));
};

exports.default = MarkDownEditor;
//# sourceMappingURL=markdown-editor.cjs.development.js.map
