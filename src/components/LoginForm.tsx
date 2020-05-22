import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import { createForm, validators, FormProps } from '../utils/form';
import { Param$LoginLoginServer, Response$LoginLoginServer } from '../typings';

interface Schema extends Param$LoginLoginServer, Response$LoginLoginServer {}

const { Form, FormItem, useForm } = createForm<Schema>();

const defaultValues: Partial<Schema> = {
  pid: 'TST',
  username: '',
  password: '',
  slotToken: '',
  userFlag: '',
};

export const useLoginForm = useForm;

const storageKey = 'login-server-params';
const initialValues = (() => {
  let result = defaultValues;
  try {
    const cache = localStorage.getItem(storageKey);
    if (cache) result = { ...result, ...JSON.parse(cache) };
  } catch (error) {}
  return result;
})();

export const LoginForm = React.memo<FormProps<Schema>>(
  ({ children, ...props }) => {
    return (
      <Form
        {...props}
        initialValues={initialValues}
        onValuesChange={(_, values) =>
          localStorage.setItem(storageKey, JSON.stringify(values))
        }
      >
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

        {children}
      </Form>
    );
  }
);
