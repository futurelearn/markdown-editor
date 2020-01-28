import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { fileUpload } from './fileUpload';

export const imageDropPlugin = (
  endpoint: { url: string; csrfToken: string },
  onError: (errors: string) => any
) =>
  new Plugin({
    props: {
      handleDOMEvents: {
        drop(view: EditorView, event: Event) {
          const dragEvent = event as DragEvent;
          if (!dragEvent.dataTransfer) return false;
          const hasFiles =
            dragEvent.dataTransfer.files && dragEvent.dataTransfer.files.length;
          if (!hasFiles) {
            return false;
          }

          const images = Array.from(dragEvent.dataTransfer.files).filter(file =>
            /image/i.test(file.type)
          );

          if (images.length === 0) {
            return false;
          }

          event.preventDefault();

          const coordinates = view.posAtCoords({
            left: dragEvent.clientX,
            top: dragEvent.clientY,
          });

          if (!coordinates) return false;

          return fileUpload(view, images, endpoint, coordinates.pos, onError);
        },
      },
    },
  });
