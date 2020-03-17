import React, { FunctionComponent } from 'react';
import { ContextualHelp as ContextualHelpType } from '../types';

const ContextualHelp: FunctionComponent<ContextualHelpType> = ({
  activeOptions,
}) => {
  const helpText: { [key: string]: string } = {
    code_block: 'Hold down shift and press enter to exit the code block',
  };

  return <p>{activeOptions.map(o => helpText[o])}</p>;
};

export default ContextualHelp;
