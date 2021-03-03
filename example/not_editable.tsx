import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownEditor from '../.';
import '../dist/markdown-editor.cjs.production.min.css';

const markdownValue = '```\ndef function\n codeblock\nend\n```';

const App = () => {
  return (
    <div>
      <MarkdownEditor
        editable={false}
        value={markdownValue}
        id="editor"
        name="editor"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
