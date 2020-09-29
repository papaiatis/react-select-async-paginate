import React from 'react';
import type {
  ComponentType,
  ReactElement,
} from 'react';
import type {
  Props as SelectProps,
} from 'react-select';

import {
  useAsyncPaginate,
} from './useAsyncPaginate';
import {
  useComponents,
} from './useComponents';

import type {
  UseAsyncPaginateResult,
  UseAsyncPaginateParams,
  ComponentProps,
} from './types';

export type Props<OptionType, Additional> =
  & SelectProps<OptionType>
  & UseAsyncPaginateParams<OptionType, Additional>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useAsyncPaginate?: typeof useAsyncPaginate;
  };

export type WithAsyncPaginateType = <OptionType, Additional = null>(
  props: Props<OptionType, Additional>,
) => ReactElement;

export const withAsyncPaginate = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<any>>,
): WithAsyncPaginateType => {
  const WithAsyncPaginate = <OptionType, Additional = null>(
    props: Props<OptionType, Additional>,
  ): ReactElement => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useAsyncPaginate: useAsyncPaginateProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType> = useAsyncPaginateProp(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponentsProp<OptionType>(components);

    return React.createElement(
      SelectComponent,
      {
        ...props,
        ...asyncPaginateProps,
        components: processedComponents,
        ref: selectRef,
      },
    );
  };

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useAsyncPaginate,
  };

  return WithAsyncPaginate;
};
