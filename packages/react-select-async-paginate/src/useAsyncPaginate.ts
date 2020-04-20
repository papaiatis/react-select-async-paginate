import {
  useState,
  useCallback,
} from 'react';

import {
  useAsyncPaginateBase,
} from './useAsyncPaginateBase';

import type {
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateResult,
} from './types';

export const useAsyncPaginatePure = <OptionType>(
  useStateParam: typeof useState,
  useCallbackParam: typeof useCallback,
  useAsyncPaginateBaseParam: typeof useAsyncPaginateBase,
  params: UseAsyncPaginateParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => {
  const [inputValue, setInputValue] = useStateParam('');
  const [menuIsOpen, setMenuIsOpen] = useStateParam(false);

  const onInputChange = useCallbackParam((inputValue: string): void => {
    setInputValue(inputValue);
  }, []);

  const onMenuClose = useCallbackParam(() => {
    setMenuIsOpen(false);
  }, []);

  const onMenuOpen = useCallbackParam(() => {
    setMenuIsOpen(true);
  }, []);

  const baseResult: UseAsyncPaginateBaseResult<OptionType> = useAsyncPaginateBaseParam(
    {
      ...params,
      inputValue,
      menuIsOpen,
    },
    deps,
  );

  return {
    ...baseResult,
    inputValue,
    menuIsOpen,
    onInputChange,
    onMenuClose,
    onMenuOpen,
  };
};

export const useAsyncPaginate = <OptionType = any>(
  params: UseAsyncPaginateParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => useAsyncPaginatePure(
  useState,
  useCallback,
  useAsyncPaginateBase,
  params,
  deps,
);
