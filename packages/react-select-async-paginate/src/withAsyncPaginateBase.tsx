import React from 'react';
import type {
  FC,
  ComponentType,
} from 'react';

import {
  useAsyncPaginateBase
} from './useAsyncPaginateBase';

import type {
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateBaseParams,
} from './types';

type Props = UseAsyncPaginateBaseParams;

export const withAsyncPaginateBase = (SelectComponent: ComponentType): FC<Props> => {
  const WithAsyncPaginateBase: FC<Props> = (props) => {
    const asyncPaginateBaseProps: UseAsyncPaginateBaseResult = useAsyncPaginateBase(props);

    return (
      <SelectComponent
        {...props}
        {...asyncPaginateBaseProps}
      />
    );
  };

  return WithAsyncPaginateBase;
};
