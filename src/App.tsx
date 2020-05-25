import React, { useState } from 'react';
import { Card, Button, FocusStyleManager } from '@blueprintjs/core';
import { createHashHistory } from 'history';
import {
  LoginForm,
  LoginFormState,
  defaultLoginFormValues,
} from './components/LoginForm';
import {
  ParamsForm,
  ParamsFormState,
  defaultParams,
  formValueToParams,
  paramsToFormValue,
} from './components/ParamsForm';
import { CopyButton } from './components/CopyButton';
import { createForm } from './utils/form';
import { loginToLoginServer } from './service';
import qs from 'qs';

type State = LoginFormState & ParamsFormState;
type Params = ParamsFormState['params'] & Omit<ParamsFormState, 'params'>;

FocusStyleManager.onlyShowFocusOnTabs();

const history = createHashHistory();

const handleValuesChange = (_: any, { params = {}, loaderUrl }: State) => {
  history.replace({
    search: qs.stringify({
      loaderUrl,
      ...formValueToParams(params),
    }),
  });
};

const { Form, useForm } = createForm<State>();

const App = () => {
  const [{ loaderUrl, ...params }] = useState<Params>(
    qs.parse(history.location.search.slice(1)) as any
  );

  const [form] = useForm();

  function getUrl() {
    return form
      .validateFields()
      .then<string>(
        ({ pid, username, slotToken, userFlag, loaderUrl, params }) => {
          if (!slotToken) {
            form.setFields([
              {
                name: 'slotToken',
                errors: ['Please click on below Get Token button'],
              },
            ]);
            return Promise.reject('slotToken is not defined');
          }

          const query = {
            pid,
            username,
            slotToken,
            userFlag,
            ...formValueToParams(params),
          };

          return `${loaderUrl}?${qs.stringify(query)}`;
        }
      );
  }

  return (
    <Card className="app" elevation={1}>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={{
          ...defaultLoginFormValues,
          loaderUrl,
          params: { ...defaultParams, ...paramsToFormValue(params, true) },
        }}
      >
        <Card className="login-form-card">
          <LoginForm>
            <Button
              fill
              onClick={() => {
                form
                  .validateFields()
                  .then(({ pid, username, password }) =>
                    loginToLoginServer({ pid, username, password }).then(
                      form.setFieldsValue
                    )
                  );
              }}
            >
              Get Token
            </Button>
          </LoginForm>
        </Card>
        <Card className="params-form-card">
          <ParamsForm onToggle={(params) => form.setFieldsValue({ params })} />
        </Card>

        <Button
          fill
          intent="primary"
          onClick={() => {
            getUrl().then((url) => window.open(url, '_blank'));
          }}
        >
          Open
        </Button>
        <CopyButton fill getValue={getUrl} />
      </Form>
    </Card>
  );
};

export default App;
