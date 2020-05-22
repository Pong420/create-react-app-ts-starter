import React, { useState } from 'react';
import { Card, Button, FocusStyleManager } from '@blueprintjs/core';
import { createHashHistory } from 'history';
import { LoginForm, useLoginForm } from './components/LoginForm';
import {
  ParamsForm,
  useParamsForm,
  formValueToParams,
} from './components/ParamsForm';
import qs from 'qs';

const history = createHashHistory();

FocusStyleManager.onlyShowFocusOnTabs();

const handleValuesChange = (_: any, { params = {}, ...rest }: any) => {
  history.replace({
    search: qs.stringify({
      ...rest,
      ...formValueToParams(params),
    }),
  });
};

const App = () => {
  const [initialValues] = useState(qs.parse(history.location.search.slice(1)));
  const [loginForm] = useLoginForm();
  const [paramsForm] = useParamsForm();

  return (
    <Card className="app" elevation={1}>
      <Card className="login-form-card">
        <LoginForm form={loginForm}>
          <Button fill>Get Token</Button>
          <Button fill intent="primary">
            Login
          </Button>
        </LoginForm>
      </Card>
      <Card className="params-form-card">
        <ParamsForm
          form={paramsForm}
          initialValues={initialValues}
          onValuesChange={handleValuesChange}
        />
      </Card>
    </Card>
  );
};

export default App;
