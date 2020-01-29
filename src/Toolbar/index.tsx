import React, { useMemo } from 'react';
import Item from './Item';
import { FunctionComponent } from 'react';
import menuItems from './menuItems';
import { ToolbarInterface } from './ToolbarInterface';

const Toolbar: FunctionComponent<ToolbarInterface> = ({
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
    </div>
  );
};

export default Toolbar;
