import React from 'react';
import { Card } from '@blueprintjs/core';
import { LoginForm } from '../../components/LoginForm';

export function Home() {
  return (
    <Card className="home" elevation={1}>
      <LoginForm />
    </Card>
  );
}
