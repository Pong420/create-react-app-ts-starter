import React, { useState, useEffect } from 'react';
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
  const [initialValues] = useState(qs.parse(history.location.search.slice(1)));
  const [paramsForm] = useParamsForm();
  const { getFieldsValue } = paramsForm;
  const [state, setState] = useState(paramsForm.getFieldsValue());
  const [url, setUrl] = useState('');

  useEffect(() => {
    setState(getFieldsValue());
  }, [getFieldsValue]);

  useEffect(() => {
    const { params = {}, loaderUrl = '', ...rest } = state || {};
    const formmated = {
      ...rest,
      ...formValueToParams(params),
    };
    const search = qs.stringify({ loaderUrl, ...formmated });
    history.replace({ search });

    setUrl(loaderUrl + '?' + qs.stringify(formmated));
  }, [state]);

  return (
    <Card className="app" elevation={1}>
      <Card className="login-form-card">
        <LoginForm />
      </Card>
      <Card className="params-form-card">
        <ParamsForm
          form={paramsForm}
          initialValues={initialValues}
          onValuesChange={(_, values) => setState(values)}
        />
      </Card>
      <Card>
        <a
          className="output-url"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      </Card>
    </Card>
  );
};

export default App;
