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
            '/images',
          csrfToken: '123',
        }}
        onError={setErrors}
      />
      {!!errors.length && <p>{errors}</p>}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
