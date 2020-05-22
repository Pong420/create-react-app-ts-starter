import React, { useState } from 'react';
import { Card, FocusStyleManager } from '@blueprintjs/core';
import { createHashHistory } from 'history';
import { LoginForm } from './components/LoginForm';
import {
  ParamsForm,
  useParamsForm,
  formValueToParams,
} from './components/ParamsForm';
import qs from 'qs';

const history = createHashHistory();

FocusStyleManager.onlyShowFocusOnTabs();

const App = () => {
  const [initialParams] = useState(qs.parse(history.location.search.slice(1)));
  const [paramsForm] = useParamsForm();

  return (
    <Card className="app" elevation={1}>
      <Card className="login-form-card">
        <LoginForm />
      </Card>
      <Card className="params-form-card">
        <ParamsForm
          form={paramsForm}
          params={initialParams}
          onValuesChange={(_, values) =>
            history.replace({ search: qs.stringify(formValueToParams(values)) })
          }
        />
      </Card>
    </Card>
  );
};

export default App;
