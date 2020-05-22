import React from 'react';
import { HTMLSelect, IHTMLSelectProps } from '@blueprintjs/core';

const gameids = window.preference.gameids || [];

export function GameIdSelect(props: IHTMLSelectProps) {
  return (
    <HTMLSelect {...props}>
      {gameids.map((id) => (
        <option key={id}>{id}</option>
      ))}
    </HTMLSelect>
  );
}
