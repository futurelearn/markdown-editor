import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { MarkDownEditor as MarkDownEditorType, MenuItem } from './types';
import { createEditorView } from './Editor';
import { EditorView } from 'prosemirror-view';
import Toolbar from './Toolbar';
import './index.scss';
import classNames from 'classnames';
import ContextualHelp from './ContextualHelp';

const MarkDownEditor: FunctionComponent<MarkDownEditorType> = ({
  id,
  name,
  onChange = () => {},
  value = '',
  placeholder = 'Enter text',
  classes = '',
  imageUploadEndpoint,
  onError = () => {},
  disabledMarks = [],
  disabledNodes = [],
  inputRef,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<EditorView | null>(null);
  const [markdownValue, setMarkdownValue] = useState<string>(value);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const disabledItems = useRef([...disabledMarks, ...disabledNodes]);
  const activeOptionsRef = useRef(activeOptions);

  const onInputChange = (md: string) => {
    setMarkdownValue(md);
    onChange(md);
  };

  const onToolbarChange = (options: string[]) => {
    if (JSON.stringify(options) !== JSON.stringify(activeOptionsRef.current)) {
      setActiveOptions(options);
    }
  };

  const initEditor = () => {
    if (editorRef.current) {
      const editorView = createEditorView({
        node: editorRef.current,
        value,
        onChange: onInputChange,
        classes,
        placeholder,
        onToolbarChange: onToolbarChange,
        imageUploadEndpoint,
        onError: onError,
        disabledNodes,
        disabledMarks,
      });

      setEditor(editorView);
    }
  };

  const onToolbarClick = useCallback(
    ({ command }: MenuItem) => {
      if (editor) {
        editor.focus();
        command(editor.state, editor.dispatch, editor);
      }
    },
    [editor]
  );

  useEffect(() => {
    activeOptionsRef.current = activeOptions;
  }, [activeOptions]);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = editor;
    }
  }, [editor, inputRef]);

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
          disabledItems={disabledItems.current}
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
