import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { MarkdownEditorInterface } from './MarkdownEditorInterface';
import { createEditorView } from './Editor';
import { EditorView } from 'prosemirror-view';
import Toolbar from './Toolbar';
import { MenuItemInterface } from './Toolbar/MenuItemInterface';
import classNames from 'classnames';
import ContextualHelp from './ContextualHelp';

const MarkDownEditor: FunctionComponent<MarkdownEditorInterface> = ({
  id,
  name,
  onChange = () => {},
  value = '',
  placeholder = 'Enter text',
  classes = 'rich-text-editor',
  imageUploadEndpoint,
  onError = () => {},
  disabledMarks = [],
  disabledNodes = [],
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<EditorView | null>(null);
  const [markdownValue, setMarkdownValue] = useState<string>(value);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);

  const onInputChange = (md: string) => {
    setMarkdownValue(md);
    onChange(md);
  };

  const initEditor = () => {
    if (editorRef.current) {
      const editorView = createEditorView({
        node: editorRef.current,
        value,
        onChange: onInputChange,
        classes,
        placeholder,
        onToolbarChange: options => setActiveOptions(options),
        imageUploadEndpoint,
        onError: onError,
        disabledNodes,
        disabledMarks,
      });

      setEditor(editorView);
    }
  };

  const onToolbarClick = ({ command }: MenuItemInterface) => {
    if (editor) {
      editor.focus();
      command(editor.state, editor.dispatch, editor);
    }
  };

  useEffect(() => {
    if (value !== markdownValue && editor) {
      editor.destroy();
      initEditor();
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initEditor();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {editor && (
        <Toolbar
          activeOptions={activeOptions}
          onClick={onToolbarClick}
          editor={editor}
          disabledItems={[...disabledMarks, ...disabledNodes]}
          imageUploadEndpoint={imageUploadEndpoint}
          onError={onError}
        />
      )}
      <div
        id={id}
        className={classNames({ hasPlaceholder: !markdownValue.length })}
        ref={editorRef}
      />
      <ContextualHelp activeOptions={activeOptions} />
      <input
        type="hidden"
        value={markdownValue}
        onChange={() => {}}
        name={name}
      />
    </>
  );
};

export default MarkDownEditor;
