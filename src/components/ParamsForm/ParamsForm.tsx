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
import { createForm, validators } from '../../utils/form';

export interface ParamsFormState {
  loaderUrl: string;
  params: { [x: string]: { checked: boolean; value: any } };
}

type Params = ParamsFormState['params'];

const { FormItem } = createForm<ParamsFormState>();

export const defaultParams: Params = paramsToFormValue(
  window.preference.defaultParams,
  false
);

const keys = Object.keys(defaultParams) as string[];

export function paramsToFormValue(
  params: Partial<Params>,
  defaultChecked = false
) {
  return Object.entries(params).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: { checked: defaultChecked, value },
    }),
    {} as Params
  );
}

type Entries<T> = [keyof T, T[keyof T]][];

export function formValueToParams(values: Params): Params {
  const entires = Object.entries(values) as Entries<Params>;
  return entires.reduce(
    (result, [key, { checked, value }]) =>
      checked ? { ...result, [key]: value } : result,
    {} as Params
  );
}

interface OnToggle {
  onToggle: (payload: Params) => void;
}

function createToggleButton(text: string, keys: string[]) {
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
            {} as Params
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

export const ParamsForm = React.memo<OnToggle>(({ onToggle }) => {
  return (
    <div className="params-form">
      <div>
        <FormItem
          name="loaderUrl"
          label="URL"
          validators={[validators.required('Please select a URL loader')]}
        >
          <LoaderUrlSelect />
        </FormItem>

        <ButtonGroup>
          <PCButton onToggle={onToggle} />
          <QAButton onToggle={onToggle} />
          <NoClutterButton onToggle={onToggle} />
        </ButtonGroup>
      </div>
      <div className="form-content">
        {keys.map((key) => {
          return (
            <div className="params-row" key={key}>
              <FormItem
                name={['params', key, 'checked']}
                valuePropName="checked"
                noStyle
              >
                <Checkbox large>{key}</Checkbox>
              </FormItem>
              <FormItem name={['params', key, 'value']} noStyle>
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
    </div>
  );
});
