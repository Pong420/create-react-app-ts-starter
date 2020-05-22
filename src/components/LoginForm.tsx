import React from 'react';
import { InputGroup, Button } from '@blueprintjs/core';
import { useRxAsync } from 'use-rx-hooks';
import { createForm, validators } from '../utils/form';
import { Param$LoginLoginServer, Response$LoginLoginServer } from '../typings';
import { loginToLoginServer } from '../service';

interface Schema extends Param$LoginLoginServer, Response$LoginLoginServer {}

const { Form, FormItem, useForm } = createForm<Schema>();

const initialValues: Partial<Schema> = {
  pid: 'TST',
  username: '',
  password: '',
  slotToken: '',
};

export function LoginForm() {
  const [form] = useForm();

  const { loading, run } = useRxAsync(loginToLoginServer, {
    defer: true,
    onSuccess: form.setFieldsValue,
  });

  return (
    <Form form={form} onFinish={run} initialValues={initialValues}>
      <FormItem name="pid" label="PID" validators={[validators.required('')]}>
        <InputGroup />
      </FormItem>

      <FormItem
        name="username"
        label="Username"
        validators={[validators.required('')]}
      >
        <InputGroup />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        validators={[validators.required('')]}
      >
        <InputGroup />
      </FormItem>

      <FormItem name="slotToken" label="slotToken">
        <InputGroup readOnly />
      </FormItem>

      <FormItem name="userFlag" label="userFlag">
        <InputGroup readOnly />
      </FormItem>

      <Button fill intent="primary" loading={loading} onClick={form.submit}>
        Login
      </Button>
    </Form>
  );
}
