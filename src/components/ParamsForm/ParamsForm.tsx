import React from 'react';
import {
  InputGroup,
  Checkbox,
  ButtonGroup,
  Button,
  IButtonProps,
} from '@blueprintjs/core';
import { GameIdSelect } from '../GameIdSelect';
import { LoaderUrlSelect } from '../LoaderUrlSelect';
import { createForm, FormProps } from '../../utils/form';

type Params = Record<string, any>;

type Schema = {
  loaderUrl: string;
  params: { [K in keyof Params]: { checked: boolean; value: Params[K] } };
};

const { Form, FormItem, useForm } = createForm<Schema>();

const defaultParams: Schema['params'] = window.preference.defaultParams;

const keys = Object.keys(defaultParams) as Array<keyof Schema['params']>;

export const useParamsForm = useForm;

export function paramsToFormValue(
  params: Partial<Params>,
  defaultChecked = false
) {
  return Object.entries(params).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: { checked: defaultChecked, value },
    }),
    {} as Schema['params']
  );
}

type Entries<T> = [keyof T, T[keyof T]][];

export function formValueToParams(values: Schema['params']): Params {
  const entires = Object.entries(values) as Entries<Schema['params']>;
  return entires.reduce(
    (result, [key, { checked, value }]) =>
      checked ? { ...result, [key]: value } : result,
    {} as Params
  );
}

interface OnToggle {
  onToggle: (payload: Schema['params']) => void;
}

function createToggleButton(text: string, keys: Array<keyof Schema['params']>) {
  const deps = keys.map((key) => ['params', key]) as any;
  return function ({ onToggle, ...props }: IButtonProps & OnToggle) {
    return (
      <FormItem deps={deps} noStyle>
        {({ params: values }) => {
          const checked = keys.every(
            (prop) => values[prop] && values[prop].checked
          );
          const newValues = keys.reduce(
            (result, prop) => ({
              ...result,
              [prop]: { ...values[prop], checked: !checked },
            }),
            {} as Schema['params']
          );
          return (
            <Button
              {...props}
              text={text}
              intent={checked ? 'primary' : 'none'}
              onClick={() => onToggle(newValues)}
            />
          );
        }}
      </FormItem>
    );
  };
}

const PCButton = createToggleButton('PC', ['dimension', 'lockRatio']);
const QAButton = createToggleButton('QA', ['env']);
const NoClutterButton = createToggleButton('NoClutter', ['skipQA', 'hideFPS']);

const nil = () => {};

export function ParamsForm({
  form,
  onValuesChange,
  initialValues,
  ...props
}: FormProps<Schema>) {
  const setFieldsValue = (form && form.setFieldsValue) || nil;
  const handleValueChange = onValuesChange || nil;
  const handleToggle: OnToggle['onToggle'] = (payload) => {
    if (form) {
      form.setFieldsValue({ params: payload });
      handleValueChange(payload, form.getFieldsValue());
    }
  };
  const { loaderUrl = window.preference.loaderUrls[0], ...initialParams } =
    initialValues || {};

  return (
    <Form
      {...props}
      className="params-form"
      form={form}
      onValuesChange={(changes, values) => {
        handleValueChange(changes, values);

        // auto select checkbox when it value changes
        if (changes.params) {
          let update: any = {};
          for (const key in changes.params) {
            if (
              typeof changes.params[key].checked === 'undefined' &&
              values.params[key].checked === false
            ) {
              update = { ...update, [key]: { checked: true } };
            }
          }
          setFieldsValue({ params: update });
        }
      }}
      initialValues={{
        loaderUrl,
        params: {
          ...defaultParams,
          ...(initialParams && paramsToFormValue(initialParams, true)),
        },
      }}
    >
      <div>
        <FormItem name="loaderUrl" label="URL">
          <LoaderUrlSelect />
        </FormItem>

        <ButtonGroup>
          <PCButton onToggle={handleToggle} />
          <QAButton onToggle={handleToggle} />
          <NoClutterButton onToggle={handleToggle} />
        </ButtonGroup>
      </div>
      <div className="form-content">
        {keys.map((key) => {
          return (
            <div className="params-row" key={key}>
              <FormItem
                name={['params', key, 'checked'] as any}
                valuePropName="checked"
                noStyle
              >
                <Checkbox large>{key}</Checkbox>
              </FormItem>
              <FormItem name={['params', key, 'value'] as any} noStyle>
                {(() => {
                  switch (key) {
                    case 'gameid':
                      return <GameIdSelect />;
                    default:
                      return <InputGroup fill />;
                  }
                })()}
              </FormItem>
            </div>
          );
        })}
      </div>
    </Form>
  );
}
