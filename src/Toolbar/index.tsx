import React from 'react';
import Item from './Item';
import { FunctionComponent } from 'react';
import menuItems from './menuItems';
import { ToolbarInterface } from './ToolbarInterface';
import ImageUpload from './ImageUpload';

const Toolbar: FunctionComponent<ToolbarInterface> = ({
  onClick,
  activeOptions,
  editor,
  imageUploadEndpoint,
  onError,
}) => (
  <div className="toolbar">
    {menuItems.map(item => (
      <Item
        key={item.name}
        icon={item.icon}
        name={item.name}
        onClick={() => onClick(item)}
        isActive={activeOptions.includes(item.name)}
      />
    ))}

    <ImageUpload
      editor={editor}
      imageUploadEndpoint={imageUploadEndpoint}
      onError={onError}
    />
  </div>
);

export default Toolbar;
