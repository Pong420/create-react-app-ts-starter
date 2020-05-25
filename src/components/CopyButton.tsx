import React, { useRef, useState } from 'react';
import { Button, IButtonProps } from '@blueprintjs/core';

interface Props extends IButtonProps {
  getValue: () => Promise<string>;
}

export function CopyButton({ getValue, ...props }: Props) {
  const [state, setState] = useState('Copy');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  let timeout: NodeJS.Timeout;

  function copyToClipboard(value: string) {
    const el = textAreaRef.current;
    if (el) {
      clearTimeout(timeout);
      el.value = value;
      el.select();
      document.execCommand('copy');
      setState('Copied!');
      timeout = setTimeout(() => setState('Copy'), 1000);
    }
  }

  return (
    <Button
      {...props}
      disabled={!document.queryCommandSupported('copy')}
      onClick={() => getValue().then(copyToClipboard)}
    >
      {state}
      <textarea
        ref={textAreaRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />
    </Button>
  );
}
