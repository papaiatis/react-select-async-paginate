import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import defaultShouldLoadMore from './defaultShouldLoadMore';
import defaultReduceOptions from './defaultReduceOptions';

import type {
  GetInitialOptionsCacheParams,
  OptionsCache,
  OptionsCacheItem,
  UseAsyncPaginateBaseParams,
  ReduceOptions,
} from './types';

const errorText = '[react-select-async-paginate] response of "loadOptions" should be an object with "options" prop, which contains array of options.';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export const validateResponse = (
  console: Console,
  response: any,
): void => {
  if (!response) {
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }

  if (!Array.isArray(response.options)) {
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }
};

export const getInitialOptionsCache = <OptionType>({
  options,
  defaultOptions,
  additional,
}: GetInitialOptionsCacheParams<OptionType>): OptionsCache<OptionType> => {
  const initialOptions = defaultOptions === true
    ? null
    : (defaultOptions instanceof Array)
      ? defaultOptions
      : options;

  if (initialOptions){
    return {
      '': {
        isFirstLoad: false,
        isLoading: false,
        options: initialOptions,
        hasMore: true,
        additional,
      },
    };
  }

  return {};
};

export const getInitialCache = <OptionType>(
  params: UseAsyncPaginateBaseParams<OptionType>,
): OptionsCacheItem<OptionType> => ({
  isFirstLoad: true,
  options: [],
  hasMore: true,
  isLoading: false,
  additional: params.additional,
});

type MapOptionsCache<OptionType> = (prevCache: OptionsCache<OptionType>) => OptionsCache<OptionType>;

type SetOptionsCache<OptionType> = (stateMapper: MapOptionsCache<OptionType>) => void;

export const requestOptions = async <OptionType>(
  paramsRef: {
    current: UseAsyncPaginateBaseParams<OptionType>,
  },
  optionsCache: OptionsCache<OptionType>,
  debounceTimeout: number,
  setOptionsCache: SetOptionsCache<OptionType>,
  validateResponseParam: typeof validateResponse,
  reduceOptions: ReduceOptions,
): Promise<void> => {
  const currentInputValue = paramsRef.current.inputValue;

  const currentOptions: OptionsCacheItem<OptionType> = optionsCache[currentInputValue]
    || getInitialCache(paramsRef.current);

  if (currentOptions.isLoading || !currentOptions.hasMore) {
    return;
  }

  setOptionsCache((prevOptionsCache: OptionsCache<OptionType>): OptionsCache<OptionType> => ({
    ...prevOptionsCache,
    [currentInputValue]: {
      ...currentOptions,
      isLoading: true,
    },
  }));

  if (debounceTimeout > 0) {
    await sleep(debounceTimeout);

    const newInputValue = paramsRef.current.inputValue;

    if (currentInputValue !== newInputValue) {
      setOptionsCache((prevOptionsCache) => ({
        ...prevOptionsCache,
        [currentInputValue]: {
          ...currentOptions,
          isLoading: false,
        },
      }));

      return;
    }
  }

  let response;
  let hasError;

  try {
    const {
      loadOptions,
    } = this.props;

    response = await loadOptions(
      currentInputValue,
      currentOptions.options,
      currentOptions.additional,
    );

    hasError = false;
  } catch (e) {
    hasError = true;
  }

  if (hasError) {
    setOptionsCache((prevOptionsCache) => ({
      ...prevOptionsCache,
      [currentInputValue]: {
        ...currentOptions,
        isLoading: false,
      },
    }));

    return;
  }

  validateResponseParam(console, response);

  const {
    options,
    hasMore,
  } = response;

  const newAdditional = response.hasOwnProperty('additional')
    ? response.additional
    : currentOptions.additional;

  setOptionsCache((prevOptionsCache) => ({
    ...prevOptionsCache,
    [currentInputValue]: {
      ...currentOptions,
      options: reduceOptions(currentOptions.options, options, newAdditional),
      hasMore: !!hasMore,
      isLoading: false,
      isFirstLoad: false,
      additional: newAdditional,
    },
  }));
};

export const useAsyncPaginateBasePure = <OptionType>(
  useRefParam: typeof useRef,
  useStateParam: typeof useState,
  useEffectParam: typeof useEffect,
  useCallbackParam: typeof useCallback,
  validateResponseParam: typeof validateResponse,
  getInitialOptionsCacheParam: typeof getInitialOptionsCache,
  requestOptionsParam: typeof requestOptions,
  params: UseAsyncPaginateBaseParams<OptionType>,
  deps: ReadonlyArray<any> = [],
) => {
  const {
    options,
    defaultOptions,
    additional,
    loadOptionsOnMenuOpen = true,
    debounceTimeout = 0,
    inputValue,
    menuIsOpen,
    reduceOptions = defaultReduceOptions,
    shouldLoadMore = defaultShouldLoadMore,
  } = params;

  const isInitRef = useRefParam(true);
  const paramsRef = useRefParam(params);

  paramsRef.current = params;

  const [optionsCache, setOptionsCache] = useStateParam(() => getInitialOptionsCacheParam({
    options,
    defaultOptions,
    additional,
  }));

  const callRequestOptions = () => {
    requestOptionsParam(
      paramsRef,
      optionsCache,
      debounceTimeout,
      setOptionsCache,
      validateResponseParam,
      reduceOptions,
    );
  };

  const handleScrolledToBottom = useCallbackParam(() => {
    const currentInputValue = paramsRef.current.inputValue;
    const currentOptions = optionsCache[currentInputValue];

    if (currentOptions) {
      callRequestOptions();
    }
  }, [optionsCache]);

  useEffectParam(() => {
    if (isInitRef.current) {
      isInitRef.current = false;
    } else {
      setOptionsCache({});
    }

    if (defaultOptions === true) {
      callRequestOptions();
    }
  }, deps);

  useEffectParam(() => {
    if (!optionsCache[inputValue]) {
      callRequestOptions();
    }
  }, [inputValue]);

  useEffectParam(() => {
    if (
      menuIsOpen
      && !optionsCache['']
      && loadOptionsOnMenuOpen
    ) {
      callRequestOptions();
    }
  }, [menuIsOpen]);

  const currentOptions: OptionsCacheItem<OptionType> = optionsCache[inputValue]
    || getInitialCache(params);

  return {
    handleScrolledToBottom,
    shouldLoadMore,
    isLoading: currentOptions.isLoading,
    isFirstLoad: currentOptions.isFirstLoad,
    options: currentOptions.options,
  };
};

export const useAsyncPaginateBase = <OptionType>(
  params: UseAsyncPaginateBaseParams<OptionType>,
  inputs: any[] = [],
) => useAsyncPaginateBasePure(
  useRef,
  useState,
  useEffect,
  useCallback,
  validateResponse,
  getInitialOptionsCache,
  requestOptions,
  params,
  inputs,
);
