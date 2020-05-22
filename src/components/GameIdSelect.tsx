import React from 'react';
import { HTMLSelect, IHTMLSelectProps } from '@blueprintjs/core';
import { gameids } from '../constants';

export function GameIdSelect(props: IHTMLSelectProps) {
  return (
    <HTMLSelect {...props}>
      {gameids.map((id) => (
        <option key={id}>{id}</option>
      ))}
    </HTMLSelect>
  );
}
