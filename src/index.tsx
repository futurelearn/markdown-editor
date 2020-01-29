import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { MarkdownEditorInterface } from './MarkdownEditorInterface';
import { createEditorView } from './Editor';
import { EditorView } from 'prosemirror-view';
import classNames from 'classnames';

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
      <div
        id={id}
        className={classNames({ hasPlaceholder: !markdownValue.length })}
        ref={editorRef}
      />
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
