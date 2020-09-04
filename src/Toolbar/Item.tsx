import React, { FunctionComponent } from 'react';
import { ToolbarItem } from '../types';
import classNames from 'classnames';
import Icons from '../Icons';

const Item: FunctionComponent<ToolbarItem> = ({
  item,
  item: { icon, name },
  isActive,
  onClick,
}) => {
  const Icon = Icons[icon];
  return (
    <button
      className={classNames('item', { 'item--active': isActive })}
      data-item={name}
      onClick={() => onClick(item)}
      type="button"
      aria-label={item.label}
      title={item.label}
    >
      <Icon />
    </button>
  );
};

export default Item;
