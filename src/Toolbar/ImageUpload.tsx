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
      <button data-item="image" className="item">
        <Icons.Image />
      </button>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={onImageUpload}
      />
    </div>
  );
};

export default ImageUpload;
