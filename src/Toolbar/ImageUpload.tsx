import React, { ChangeEvent } from 'react';
import { fileUpload } from '../Editor/Plugins/fileUpload';
import Icons from '../Icons';

const ImageUpload = ({
  editor,
  imageUploadEndpoint,
  onError,
}: {
  editor: any;
  imageUploadEndpoint: any;
  onError: any;
}) => {
  const onImageUpload = (e: ChangeEvent) => {
    if (!imageUploadEndpoint) return;
    if (!editor) return;
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    if (!target.files) return;

    e.preventDefault();

    fileUpload(
      editor,
      Array.from(target.files),
      imageUploadEndpoint,
      editor.state.tr.selection.from,
      onError
    );
    editor.focus();
    target.value = '';
  };

  return (
    <div className="fileUploadWrapper">
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={onImageUpload}
      />
      <button
        data-item="image"
        className="item fileUploadWrapper--button"
        aria-label="Upload image"
        title="Upload image"
      >
        <Icons.Image />
      </button>
    </div>
  );
};

export default ImageUpload;
