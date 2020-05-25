import React from 'react';
import { HTMLSelect, IHTMLSelectProps } from '@blueprintjs/core';

const urls = window.preference.loaderUrls || [];

export function LoaderUrlSelect(props: IHTMLSelectProps) {
  return (
    <HTMLSelect {...props}>
      <option />
      {urls.map((url) => (
        <option key={url}>{url}</option>
      ))}
    </HTMLSelect>
  );
}
