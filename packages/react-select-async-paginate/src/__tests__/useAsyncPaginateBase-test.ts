import {
  useCallback as reactUseCallbact,
  useState as reactUseState,
} from 'react';

import defaultShouldLoadMore from '../defaultShouldLoadMore';
import defaultReduceOptions from '../defaultReduceOptions';

import {
  getInitialOptionsCache,
  getInitialCache,
  validateResponse,
  requestOptions,
  useAsyncPaginateBasePure,
} from '../useAsyncPaginateBase';

import type {
  GetInitialOptionsCacheParams,
  OptionsCache,
  UseAsyncPaginateBaseParams,
  Response,
  OptionsList,
} from '../types';

type UseStateResult = [OptionsCache, (OptionsCache) => void];
type UseStateArgs = [() => OptionsCache];
type LoadOptionsArgs = [
  string,
  OptionsList,
  any,
];

const defaultParams: UseAsyncPaginateBaseParams = {
  loadOptions: () => ({
    options: [],
  }),
  inputValue: '',
  menuIsOpen: false,
};

const makeUseRef = () => jest.fn()
  .mockReturnValueOnce({
    current: true,
  })
  .mockReturnValueOnce({
    current: defaultParams,
  });

const defaultUseEffect = () => {};

const defaultUseCallback: typeof reactUseCallbact = (fn) => fn;

const defaultValidateResponse = () => {};

const defaultRequestOptions = async () => {};

const defaultUseState = () => [{}, () => {}];

describe('getInitialOptionsCache', () => {
  test('should return empty options cache', () => {
    const initialOptionsCache = getInitialOptionsCache({});

    expect(initialOptionsCache).toEqual({});
  });

  test('should return options cache with "options" prop', () => {
    const options = [
      {
        label: 'label 1',
        value: 'value 1',
      },
      {
        label: 'label 2',
        value: 'value 2',
      },
    ];

    const initialOptionsCache = getInitialOptionsCache({
      options,
    });

    expect(initialOptionsCache).toEqual({
      '': {
        isFirstLoad: false,
        isLoading: false,
        hasMore: true,
        options,
        additional: undefined,
      },
    });
  });

  test('should return options cache with "defaultOptions" prop', () => {
    const options = [
      {
        label: 'label 1',
        value: 'value 1',
      },
    ];

    const defaultOptions = [
      {
        label: 'label 2',
        value: 'value 2',
      },
      {
        label: 'label 3',
        value: 'value 3',
      },
    ];

    const initialOptionsCache = getInitialOptionsCache({
      options,
      defaultOptions,
    });

    expect(initialOptionsCache).toEqual({
      '': {
        isFirstLoad: false,
        isLoading: false,
        hasMore: true,
        options: defaultOptions,
        additional: undefined,
      },
    });
  });

  test('should not set options cache if "defaultOptions" is true', () => {
    const options = [
      {
        label: 'label 1',
        value: 'value 1',
      },
    ];

    const initialOptionsCache = getInitialOptionsCache({
      options,
      defaultOptions: true,
    });

    expect(initialOptionsCache).toEqual({});
  });
});

describe('getInitialCache', () => {
  test('should return initial cache', () => {
    const additional = Symbol('additional');

    const params = {
      ...defaultParams,
      additional,
    };

    expect(getInitialCache(params)).toEqual({
      isFirstLoad: true,
      options: [],
      hasMore: true,
      isLoading: false,
      additional,
    });
  });
});

describe('validateResponse', () => {
  const fakeConsole = {
    error: () => {},
  };

  test('should throw error if response falsy', () => {
    expect(() => {
      validateResponse(fakeConsole as Console, null);
    }).toThrowError();
  });

  test('should throw error if list of options is not array', () => {
    expect(() => {
      validateResponse(fakeConsole as Console, {
        options: 123,
      });
    }).toThrowError();
  });
});

describe('useAsyncPaginateBasePure', () => {
  test('should call getInitialOptionsCache on init', () => {
    const getInitialOptionsCache = jest.fn<OptionsCache, [GetInitialOptionsCacheParams]>(() => ({}));
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => ({})]);

    const options = [
      {
        label: 'label 1',
        value: 'value 1',
      },
    ];

    const defaultOptions = [
      {
        label: 'label 2',
        value: 'value 2',
      },
      {
        label: 'label 3',
        value: 'value 3',
      },
    ];

    const additional = {
      page: 2,
    };

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        options,
        defaultOptions,
        additional,
      },
    );

    useState.mock.calls[0][0]();

    expect(getInitialOptionsCache.mock.calls.length).toBe(1);
    expect(getInitialOptionsCache.mock.calls[0][0]).toEqual({
      options,
      defaultOptions,
      additional,
    });
  });

  test('should call getInitialOptionsCache on init', () => {
    const getInitialOptionsCache = jest.fn<OptionsCache, [GetInitialOptionsCacheParams]>(() => ({}));
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => ({})]);

    const options = [
      {
        label: 'label 1',
        value: 'value 1',
      },
    ];

    const defaultOptions = [
      {
        label: 'label 2',
        value: 'value 2',
      },
      {
        label: 'label 3',
        value: 'value 3',
      },
    ];

    const additional = {
      page: 2,
    };

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        options,
        defaultOptions,
        additional,
      },
    );

    useState.mock.calls[0][0]();

    expect(getInitialOptionsCache.mock.calls.length).toBe(1);
    expect(getInitialOptionsCache.mock.calls[0][0]).toEqual({
      options,
      defaultOptions,
      additional,
    });
  });

  test('should provide deps to first useEffect', async () => {
    const deps = [1, 2, 3];
    const useEffect = jest.fn();

    useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      defaultParams,
      deps,
    );

    expect(useEffect.mock.calls[0][1]).toBe(deps);
  });

  test('should not load options from first useEffect if "defaultOptions" is not true', async () => {
    const useEffect = jest.fn();
    const requestOptions = jest.fn();

    useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        defaultOptions: [],
      },
    );

    useEffect.mock.calls[0][0]();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should load options from first useEffect if "defaultOptions" is true', async () => {
    const useEffect = jest.fn();
    const requestOptions = jest.fn();

    useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        defaultOptions: true,
      },
    );

    useEffect.mock.calls[0][0]();

    expect(requestOptions.mock.calls.length).toBe(1);
  });

  test('should not reset options cache from first useEffect', async () => {
    const isInit = {
      current: true,
    };

    const useRef = jest.fn()
      .mockReturnValueOnce(isInit)
      .mockReturnValueOnce({
        current: defaultParams,
      });

    const setOptionsCache = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, setOptionsCache]);

    useAsyncPaginateBasePure(
      useRef,
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      defaultParams,
    );

    useEffect.mock.calls[0][0]();

    expect(isInit.current).toBe(false);
    expect(setOptionsCache.mock.calls.length).toBe(0);
  });

  test('should reset options cache from not first useEffect', async () => {
    const isInit = {
      current: false,
    };

    const useRef = jest.fn()
      .mockReturnValueOnce(isInit)
      .mockReturnValueOnce({
        current: defaultParams,
      });

    const setOptionsCache = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, setOptionsCache]);

    useAsyncPaginateBasePure(
      useRef,
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      defaultParams,
    );

    useEffect.mock.calls[0][0]();

    expect(isInit.current).toBe(false);
    expect(setOptionsCache.mock.calls.length).toBe(1);
    expect(setOptionsCache.mock.calls[0][0]).toEqual({});
  });

  test('should provide inputValue as dependency to second useEffect', async () => {
    const useEffect = jest.fn();

    useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    expect(useEffect.mock.calls[1][1]).toEqual(['test']);
  });

  test('should load options on inputValue change if options are not cached', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => {}]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    useEffect.mock.calls[1][0]();

    expect(requestOptions.mock.calls.length).toBe(1);
  });

  test('should not load options on inputValue change if options are cached', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        test: {
          options: [
            {
              value: 1,
              label: '1',
            },

            {
              value: 2,
              label: '2',
            },
          ],
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
        },
      }, () => { }]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    useEffect.mock.calls[1][0]();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should provide menuIsOpen as dependency to third useEffect', async () => {
    const useEffect = jest.fn();

    useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        menuIsOpen: true,
      },
    );

    expect(useEffect.mock.calls[2][1]).toEqual([true]);
  });

  test('should not load options from third useEffect if menuIsOpen is false', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => { }]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        menuIsOpen: false,
      },
    );

    useEffect.mock.calls[2][0]();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should not load options from third useEffect if optionsCache defined for empty search', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        '': {
          options: [],
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
        },
      }, () => {}]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        menuIsOpen: true,
      },
    );

    useEffect.mock.calls[2][0]();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should not load options from third useEffect if loadOptionsOnMenuOpen is false', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => {}]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        loadOptionsOnMenuOpen: false,
        menuIsOpen: true,
      },
    );

    useEffect.mock.calls[2][0]();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should load options from third useEffect', async () => {
    const requestOptions = jest.fn();
    const useEffect = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => { }]);

    useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      useEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        menuIsOpen: true,
      },
    );

    useEffect.mock.calls[2][0]();

    expect(requestOptions.mock.calls.length).toBe(1);
  });

  test('should not load options on scroll to bottom if cache not defined for current search', async () => {
    const requestOptions = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    result.handleScrolledToBottom();

    expect(requestOptions.mock.calls.length).toBe(0);
  });

  test('should load options on scroll to bottom if cache defined for current search', async () => {
    const requestOptions = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        test: {
          options: [],
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
        },
      }, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    result.handleScrolledToBottom();

    expect(requestOptions.mock.calls.length).toBe(1);
  });

  test('should provide default shouldLoadMore', async () => {
    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      defaultParams,
    );

    expect(result.shouldLoadMore).toBe(defaultShouldLoadMore);
  });

  test('should provide redefined shouldLoadMore', async () => {
    const shouldLoadMore = jest.fn();

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        shouldLoadMore,
      },
    );

    expect(result.shouldLoadMore).toBe(shouldLoadMore);
  });

  test('should provide default filterOption', async () => {
    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      defaultParams,
    );

    expect(result.filterOption).toBe(null);
  });

  test('should provide default filterOption', async () => {
    const filterOption = jest.fn();

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (defaultUseState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        filterOption,
      },
    );

    expect(result.filterOption).toBe(filterOption);
  });

  test('should provide initial params if cache not defined for current search', async () => {
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{}, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    expect(result.isLoading).toBe(false);
    expect(result.isFirstLoad).toBe(true);
    expect(result.options).toEqual([]);
  });

  test('should provide params from cache if cache defined for current search', async () => {
    const options = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        test: {
          options,
          hasMore: true,
          isLoading: true,
          isFirstLoad: false,
        },
      }, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      defaultRequestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    expect(result.isLoading).toBe(true);
    expect(result.isFirstLoad).toBe(false);
    expect(result.options).toEqual(options);
  });

  test('should provide default reduceOptions to requestOptions', async () => {
    const requestOptions = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        test: {
          options: [],
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
        },
      }, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
      },
    );

    result.handleScrolledToBottom();

    expect(requestOptions.mock.calls.length).toBe(1);
    expect(requestOptions.mock.calls[0][6]).toBe(defaultReduceOptions);
  });

  test('should provide redefined reduceOptions to requestOptions', async () => {
    const requestOptions = jest.fn();
    const reduceOptions = jest.fn();
    const useState = jest.fn<UseStateResult, UseStateArgs>()
      .mockReturnValue([{
        test: {
          options: [],
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
        },
      }, () => { }]);

    const result = useAsyncPaginateBasePure(
      makeUseRef(),
      (useState as unknown as typeof reactUseState),
      defaultUseEffect,
      defaultUseCallback,
      defaultValidateResponse,
      getInitialOptionsCache,
      requestOptions,
      {
        ...defaultParams,
        inputValue: 'test',
        reduceOptions,
      },
    );

    result.handleScrolledToBottom();

    expect(requestOptions.mock.calls.length).toBe(1);
    expect(requestOptions.mock.calls[0][6]).toBe(reduceOptions);
  });
});

describe('requestOptions', () => {
  const defaultParamsRef = {
    current: defaultParams,
  };

  const defaultSleep = async () => {};

  const defaultSetOptionsCache = () => {};

  test('should request if options not cached', async () => {
    const newOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: newOptions,
      hasMore: true,
    }));

    const additional = Symbol('additional');

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional,
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toEqual([]);
    expect(loadOptions.mock.calls[0][2]).toEqual(additional);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0]({});

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: false,
        options: newOptions,
        hasMore: true,
        isLoading: false,
        additional,
      }
    });
  });

  test('should request if options cached', async () => {
    const prevOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const newOptions = [
      {
        value: 3,
        label: '4',
      },

      {
        value: 4,
        label: '4',
      },
    ];

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: newOptions,
      hasMore: true,
    }));

    const additional = Symbol('additional');

    const initialOptionsCache = {
      test: {
        options: prevOptions,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
        additional,
      },
    };

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
        },
      },
      initialOptionsCache,
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toBe(prevOptions);
    expect(loadOptions.mock.calls[0][2]).toEqual(additional);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0](initialOptionsCache);

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: false,
        options: prevOptions,
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: false,
        options: [
          ...prevOptions,
          ...newOptions,
        ],
        hasMore: true,
        isLoading: false,
        additional,
      }
    });
  });

  test('should not request if options are loading for current search', async () => {
    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
      hasMore: true,
    }));

    const additional = Symbol('additional');

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional,
        },
      },
      {
        test: {
          options: [],
          hasMore: true,
          isLoading: true,
          isFirstLoad: false,
        },
      },
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(0);
    expect(setOptionsCache.mock.calls.length).toBe(0);
  });

  test('should not request if hasMore is false for current search', async () => {
    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
      hasMore: true,
    }));

    const additional = Symbol('additional');

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional,
        },
      },
      {
        test: {
          options: [],
          hasMore: false,
          isLoading: false,
          isFirstLoad: false,
        },
      },
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(0);
    expect(setOptionsCache.mock.calls.length).toBe(0);
  });

  test('should request with error', async () => {
    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => {
      throw new Error();
    });

    const additional = Symbol('additional');

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional,
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toEqual([]);
    expect(loadOptions.mock.calls[0][2]).toEqual(additional);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0]({});

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: false,
        additional,
      }
    });
  });

  test('should redefine reduceOptions', async () => {
    const prevOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const newOptions = [
      {
        value: 3,
        label: '4',
      },

      {
        value: 4,
        label: '4',
      },
    ];

    const reducedOptions = [
      {
        value: 5,
        label: '5',
      },
    ];

    const reduceOptions = jest.fn<OptionsList, [
      OptionsList,
      OptionsList,
      any,
    ]>(() => reducedOptions);

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: newOptions,
      hasMore: true,
    }));

    const additional = Symbol('additional');

    const initialOptionsCache = {
      test: {
        options: prevOptions,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
        additional,
      },
    };

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
        },
      },
      initialOptionsCache,
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      reduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toBe(prevOptions);
    expect(loadOptions.mock.calls[0][2]).toEqual(additional);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0](initialOptionsCache);

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: false,
        options: prevOptions,
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: false,
        options: reducedOptions,
        hasMore: true,
        isLoading: false,
        additional,
      }
    });

    expect(reduceOptions.mock.calls.length).toBe(1);
    expect(reduceOptions.mock.calls[0][0]).toBe(prevOptions);
    expect(reduceOptions.mock.calls[0][1]).toBe(newOptions);
    expect(reduceOptions.mock.calls[0][2]).toBe(additional);
  });

  test('should validate response', async () => {
    const newOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const response = {
      options: newOptions,
      hasMore: true,
    };

    const validateResponseParam = jest.fn<void, [Console, any]>(() => {
      throw new Error();
    });

    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => response);

    let hasError = false;
    try {
      await requestOptions(
        {
          ...defaultParamsRef,
          current: {
            ...defaultParams,
            loadOptions,
          },
        },
        {},
        0,
        defaultSleep,
        defaultSetOptionsCache,
        validateResponseParam,
        defaultReduceOptions,
      );
    } catch(e) {
      hasError = true;
    }

    expect(hasError).toBe(true);

    expect(validateResponseParam.mock.calls.length).toBe(1);
    expect(validateResponseParam.mock.calls[0][1]).toBe(response);
  });

  test('should not sleep if debounceTimeout is 0', async () => {
    const sleep = jest.fn();

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
        },
      },
      {},
      0,
      sleep,
      defaultSetOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(sleep.mock.calls.length).toBe(0);
  });

  test('should sleep if debounceTimeout bigger than 0', async () => {
    const sleep = jest.fn();

    const newOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: newOptions,
      hasMore: true,
    }));

    const additional = Symbol('additional');

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional,
        },
      },
      {},
      1234,
      sleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(sleep.mock.calls.length).toBe(1);
    expect(sleep.mock.calls[0][0]).toBe(1234);

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toEqual([]);
    expect(loadOptions.mock.calls[0][2]).toEqual(additional);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0]({});

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: false,
        options: newOptions,
        hasMore: true,
        isLoading: false,
        additional,
      }
    });
  });

  test('should cancel loading if inputValue has changed during sleep', async () => {
    const newOptions = [
      {
        value: 1,
        label: '1',
      },

      {
        value: 2,
        label: '2',
      },
    ];

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: newOptions,
      hasMore: true,
    }));

    const additional = Symbol('additional');

    const paramsRef = {
      ...defaultParamsRef,
      current: {
        ...defaultParams,
        loadOptions,
        inputValue: 'test',
        additional,
      },
    };

    await requestOptions(
      paramsRef,
      {},
      1234,
      async () => {
        paramsRef.current.inputValue = 'test2';
      },
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(loadOptions.mock.calls.length).toBe(0);

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const intermediateCache = setOptionsCache.mock.calls[0][0]({});

    expect(intermediateCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: true,
        additional,
      }
    });

    const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

    expect(lastCache).toEqual({
      test: {
        isFirstLoad: true,
        options: [],
        hasMore: true,
        isLoading: false,
        additional,
      }
    });
  });

  test('should redefine additional with response', async () => {
    const additional1 = Symbol('additional1');
    const additional2 = Symbol('additional2');

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
      hasMore: true,
      additional: additional2,
    }));

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional: additional1,
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const lastCache = setOptionsCache.mock.calls[1][0](
      setOptionsCache.mock.calls[0][0](
        {},
      ),
    );

    expect(lastCache.test.additional).toBe(additional2);
  });

  test('should not redefine additional with response', async () => {
    const additional1 = Symbol('additional1');

    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
      hasMore: true,
    }));

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
          additional: additional1,
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const lastCache = setOptionsCache.mock.calls[1][0](
      setOptionsCache.mock.calls[0][0](
        {},
      ),
    );

    expect(lastCache.test.additional).toBe(additional1);
  });

  test('should set truthy hasMore with response', async () => {
    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
      hasMore: true,
    }));

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const lastCache = setOptionsCache.mock.calls[1][0](
      setOptionsCache.mock.calls[0][0](
        {},
      ),
    );

    expect(lastCache.test.hasMore).toBe(true);
  });

  test('should set falsy hasMore with response', async () => {
    const setOptionsCache = jest.fn();
    const loadOptions = jest.fn<Response, LoadOptionsArgs>(() => ({
      options: [],
    }));

    await requestOptions(
      {
        ...defaultParamsRef,
        current: {
          ...defaultParams,
          loadOptions,
          inputValue: 'test',
        },
      },
      {},
      0,
      defaultSleep,
      setOptionsCache,
      defaultValidateResponse,
      defaultReduceOptions,
    );

    expect(setOptionsCache.mock.calls.length).toBe(2);

    const lastCache = setOptionsCache.mock.calls[1][0](
      setOptionsCache.mock.calls[0][0](
        {},
      ),
    );

    expect(lastCache.test.hasMore).toBe(false);
  });
});
