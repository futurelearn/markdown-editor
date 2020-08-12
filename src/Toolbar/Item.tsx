import React, { FunctionComponent } from 'react';
import { ToolbarItem } from '../types';
import classNames from 'classnames';
import Icons from '../Icons';

const Item: FunctionComponent<ToolbarItem> = ({
  item,
  item: { icon, name, title },
  isActive,
  onClick,
}) => {
  const Icon = Icons[icon];
  return (
    <button
      className={classNames('item', { 'item--active': isActive })}
      data-item={name}
      onClick={() => onClick(item)}
      title={title}
      type="button"
    >
      <Icon />
    </button>
  );
};

export default Item;
