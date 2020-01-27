import { createEditorView } from '../../src/Editor/View';
import { markPlugins } from '../../src/Editor/Marks';

describe('createEditorView', () => {
  let args = {
    node: document.createElement('div'),
    value: '',
    classes: '',
    onChange: jest.fn(),
    placeholder: '',
    onToolbarChange: jest.fn(),
    imageUploadEndpoint: { url: '/url', csrfToken: '123' },
    onError: jest.fn(),
    disabledMarks: [],
    disabledNodes: [],
  }

  beforeAll(() => {
    jest.enableAutomock();
  });

  afterAll(() => {
    jest.disableAutomock();
  });

  describe('disabledMarks', () => {
    const disabledMarks = ['strong'];

    beforeEach(() => {
      createEditorView({ ...args, disabledMarks });
    });

    it('excludes the disabled marks from the marksPlugin', () => {
      expect(markPlugins).toHaveBeenCalledWith({ disabledMarks })
    });

    it('excludes the disabled marks from the markdown schema')
  });
});
