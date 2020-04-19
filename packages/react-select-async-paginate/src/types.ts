import type {
  GroupedOptionsType,
  OptionsType,
} from 'react-select';
import { Option } from 'react-select/src/filters';

export type OptionsList<OptionType> = GroupedOptionsType<OptionType> | OptionsType<OptionType>;

export type ReduceOptions<OptionType = any> = (
  prevOptions: OptionsList<OptionType>,
  loadedOptions: OptionsList<OptionType>,
  additional: any,
) => OptionsList<OptionType>;

export type GetInitialOptionsCacheParams<OptionType = any> = {
  options?: OptionType[];
  defaultOptions?: boolean | OptionType[];
  additional?: any;
};

export type OptionsCacheItem<OptionType> = {
  isFirstLoad: boolean;
  isLoading: boolean;
  options: GroupedOptionsType<OptionType> | OptionsType<OptionType>;
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

export type UseAsyncPaginateBaseParams<OptionType = any> = {
  options?: OptionType[];
  defaultOptions?: boolean | OptionType[];
  additional?: any;
  loadOptionsOnMenuOpen?: boolean;
  debounceTimeout?: number;
  reduceOptions?: ReduceOptions<OptionType>;
  shouldLoadMore?: ShouldLoadMore;
  inputValue: string;
  menuIsOpen: boolean;
};
