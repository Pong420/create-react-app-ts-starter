import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import { createForm, validators } from '../utils/form';
import { Param$LoginLoginServer, Response$LoginLoginServer } from '../typings';

export interface LoginFormState
  extends Param$LoginLoginServer,
    Response$LoginLoginServer {}

const { FormItem } = createForm<LoginFormState>();

export const defaultLoginFormValues: Partial<LoginFormState> = {
  pid: 'TST',
  username: '',
  password: '',
  slotToken: '',
  userFlag: '',
};

// const storageKey = 'login-server-params';
// const initialValues = (() => {
//   let result = defaultValues;
//   try {
//     const cache = localStorage.getItem(storageKey);
//     if (cache) result = { ...result, ...JSON.parse(cache) };
//   } catch (error) {}
//   return result;
// })();

export const LoginForm = React.memo(({ children }) => {
  return (
    <>
      <FormItem name="pid" label="PID" validators={[validators.required('')]}>
        <InputGroup />
      </FormItem>

      <FormItem
        name="username"
        label="Username"
        validators={[validators.required('Username cannot be empty')]}
      >
        <InputGroup />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        validators={[validators.required('Password cannot be empty')]}
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
    </>
  );
});
