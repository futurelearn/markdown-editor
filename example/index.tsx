import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownEditor from '../.';
import '../dist/markdown-editor.esm.css';

const App = () => {
  const [errors, setErrors] = React.useState('');
  return (
    <div>
      <MarkdownEditor
        id="editor"
        name="editor"
        imageUploadEndpoint={{
          url:
            'https://api.imgbb.com/1/upload?key=2296ef17f6f7baea4b9330d8c2aff17e',
          csrfToken: '123',
        }}
        onError={setErrors}
      />
      {!!errors.length && <p>{errors}</p>}
      <MarkdownEditor
        id="editorWithDisabled"
        name="editorWithDisabled"
        onError={setErrors}
        disabledMarks={['code']}
        disabledNodes={['heading']}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
