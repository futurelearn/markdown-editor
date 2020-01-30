import React, { FunctionComponent } from 'react';
import { ToolbarItemInterface } from './ToolbarItemInterface';
import classNames from 'classnames';
import Icons from '../Icons';

const Item: FunctionComponent<ToolbarItemInterface> = ({
  icon,
  isActive,
  onClick,
  name,
}) => {
  const Icon = Icons[icon];
  return (
    <button
      className={classNames('item', { 'item--active': isActive })}
      data-item={name}
      onClick={onClick}
      type="button"
    >
      <Icon />
    </button>
  );
};

export default Item;
