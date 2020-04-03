import { placeholderPlugin, findPlaceholder } from './placeholder';
import { EditorView } from 'prosemirror-view';

export const fileUpload = (
  view: EditorView,
  images: File[],
  endpoint: { url: string; csrfToken: string },
  position: number,
  onError: (errors: string) => any
): boolean => {
  let id = {};
  const confirmResult = window.confirm('I am authorised to use this content');
  if (!confirmResult) {
    return false;
  }

  const tr = view.state.tr;
  tr.setMeta(placeholderPlugin, { add: { id, pos: position } });
  tr.setSelection(tr.selection);
  view.dispatch(tr);
  const { schema } = view.state;

  images.forEach(image => {
    const pos = findPlaceholder(view.state, id);
    if (!pos) return;
    const formData = new FormData();
    formData.append('image', image);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', endpoint.url, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', endpoint.csrfToken);
    xhr.onerror = () => {
      const transaction = view.state.tr.setMeta(placeholderPlugin, {
        remove: { id },
      });
      onError('Sorry something went wrong');
      view.dispatch(transaction);
    };

    xhr.onload = () => {
      let transaction;
      let jsonBody;
      try {
        jsonBody = JSON.parse(xhr.response);
      } catch {
        jsonBody = { errors: 'Sorry something went wrong' };
      }
      if ([200, 201].includes(xhr.status)) {
        const node = schema.nodes['block-image'].create({}, [
          schema.nodes.image.create({
            src: jsonBody.data.url,
          }),
        ]);

        transaction = view.state.tr
          .replaceWith(pos, pos, node)
          .setMeta(placeholderPlugin, { remove: { id } });
      } else {
        transaction = view.state.tr.setMeta(placeholderPlugin, {
          remove: { id },
        });
        onError(jsonBody.errors);
      }
      view.dispatch(transaction);
    };
    xhr.send(formData);
  });

  return true;
};
