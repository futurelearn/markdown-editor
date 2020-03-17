import React, { useMemo } from 'react';
import Item from './Item';
import { FunctionComponent } from 'react';
import menuItems from './menuItems';
import { Toolbar as ToolbarType } from '../types';
import ImageUpload from './ImageUpload';

const Toolbar: FunctionComponent<ToolbarType> = ({
  onClick,
  activeOptions,
  editor,
  imageUploadEndpoint,
  disabledItems = [],
  onError,
}) => {
  const menuItemsToRender = useMemo(() => {
    return menuItems(editor.state.schema).filter(
      i => !disabledItems.includes(i.name)
    );
  }, [disabledItems, editor.state.schema]);

  return (
    <div className="toolbar">
      {menuItemsToRender.map(item => (
        <Item
          key={item.name}
          icon={item.icon}
          name={item.name}
          onClick={() => onClick(item)}
          isActive={activeOptions.includes(item.name)}
        />
      ))}

      {!disabledItems.includes('image') && (
        <ImageUpload
          editor={editor}
          imageUploadEndpoint={imageUploadEndpoint}
          onError={onError}
        />
      )}
    </div>
  );
};

export default Toolbar;
