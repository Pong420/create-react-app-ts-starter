import React from 'react';
import {
  InputGroup,
  Checkbox,
  ButtonGroup,
  Button,
  IButtonProps,
} from '@blueprintjs/core';
import { GameIdSelect } from '../GameIdSelect';
import { createForm, FormProps } from '../../utils/form';
import { NamePath } from '../../utils/form/typings';

type Params = Record<string, any>;

type Schema = {
  [K in keyof Params]: { checked: boolean; value: Params[K] };
};

type Name = NamePath<Schema>;

const { Form, FormItem, useForm } = createForm<Schema>();

const defaultParams: Schema = window.preference.defaultParams;

const keys = Object.keys(defaultParams) as Array<keyof Schema>;

export const useParamsForm = useForm;

export function paramsToFormValue(
  params: Partial<Params>,
  defaultChecked = false
): Schema {
  return Object.entries(params).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: { checked: defaultChecked, value },
    }),
    {} as Schema
  );
}

export function formValueToParams(values: Schema): Params {
  const entires = Object.entries(values) as [
    keyof Schema,
    Schema[keyof Schema]
  ][];
  return entires.reduce(
    (result, [key, { checked, value }]) =>
      checked ? { ...result, [key]: value } : result,
    {} as Params
  );
}

interface OnToggle {
  onToggle: (payload: Partial<Schema>) => void;
}

function createToggleButton(text: string, deps: Array<keyof Schema>) {
  return function ({ onToggle, ...props }: IButtonProps & OnToggle) {
    return (
      <FormItem deps={deps} noStyle>
        {(values) => {
          const checked = deps.every(
            (prop) => values[prop] && values[prop].checked
          );
          const newValues = deps.reduce(
            (result, prop) => ({
              ...result,
              [prop]: { ...values[prop], checked: !checked },
            }),
            {} as Partial<Schema>
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

export function ParamsForm({
  params,
  form,
  onValuesChange,
  ...props
}: FormProps<Schema> & { params?: Partial<Params> }) {
  const handleToggle: OnToggle['onToggle'] = (payload) => {
    if (form && onValuesChange) {
      form.setFieldsValue(payload);
      onValuesChange(payload, form.getFieldsValue());
    }
  };

  return (
    <Form
      {...props}
      className="params-form"
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{
        ...defaultParams,
        ...(params && paramsToFormValue(params, true)),
      }}
    >
      <div>
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
                name={[key, 'checked'] as Name}
                valuePropName="checked"
                noStyle
              >
                <Checkbox large>{key}</Checkbox>
              </FormItem>
              <FormItem name={[key, 'value'] as Name} noStyle>
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
