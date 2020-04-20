import type {
  GroupedOptionsType,
  OptionsType,
} from 'react-select';

export type OptionsList<OptionType = any> = GroupedOptionsType<OptionType> | OptionsType<OptionType>;

export type ReduceOptions<OptionType = any> = (
  prevOptions: OptionsList<OptionType>,
  loadedOptions: OptionsList<OptionType>,
  additional: any,
) => OptionsList<OptionType>;

export type GetInitialOptionsCacheParams<OptionType = any> = {
  options?: OptionsList<OptionType>;
  defaultOptions?: boolean | OptionsList<OptionType>;
  additional?: any;
};

export type OptionsCacheItem<OptionType> = {
  isFirstLoad: boolean;
  isLoading: boolean;
  options: OptionsList<OptionType>;
  hasMore: boolean;
  additional?: any;
};

export type OptionsCache<OptionType = any> = {
  [key: string]: OptionsCacheItem<OptionType>;
};

export type ShouldLoadMore = (
  scrollHeight: number,
  clientHeight: number,
  scrollTop: number,
) => boolean;

export type Response<OptionType = any> = {
  options: OptionsList<OptionType>;
  hasMore?: boolean;
  additional?: any;
};

export type LoadOptions<OptionType = any> = (
  inputValue: string,
  options: OptionsList<OptionType>,
  additional?: any,
) => Response<OptionType> | Promise<Response<OptionType>>;

export type FilterOption = ((
  option: any,
  rawInput: string
) => boolean) | null;

export type UseAsyncPaginateBaseResult<OptionType = any> = {
  handleScrolledToBottom: () => void;
  shouldLoadMore: ShouldLoadMore;
  isLoading: boolean;
  isFirstLoad: boolean;
  options: OptionsList<OptionType>;
  filterOption: FilterOption;
};

export type UseAsyncPaginateResult<OptionsType = any> = UseAsyncPaginateBaseResult<OptionsType> & {
  inputValue: string;
  menuIsOpen: boolean;
  onInputChange: (inputValue: string) => void;
  onMenuClose: () => void;
  onMenuOpen: () => void;
};

export type UseAsyncPaginateParams<OptionType = any> = {
  loadOptions: LoadOptions<OptionType>;
  options?: OptionsList<OptionType>;
  defaultOptions?: boolean | OptionsList<OptionType>;
  additional?: any;
  loadOptionsOnMenuOpen?: boolean;
  debounceTimeout?: number;
  reduceOptions?: ReduceOptions<OptionType>;
  shouldLoadMore?: ShouldLoadMore;
  filterOption?: FilterOption;
};

export type UseAsyncPaginateBaseParams<OptionType = any> = UseAsyncPaginateParams<OptionType> & {
  inputValue: string;
  menuIsOpen: boolean;
};
