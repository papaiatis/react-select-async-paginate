import type {
  OptionTypeBase,
  OptionsList,
} from './types';

export const defaultReduceOptions = <OptionType extends OptionTypeBase>(
  prevOptions: OptionsList<OptionType>,
  loadedOptions: OptionsList<OptionType>,
): OptionsList<OptionType> => [...prevOptions, ...loadedOptions] as OptionsList<OptionType>;
