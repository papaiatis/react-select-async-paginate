import type {
  ReduceOptions,
} from './types';

const defaultReduceOptions: ReduceOptions = (
  prevOptions,
  loadedOptions,
) => [...prevOptions, ...loadedOptions];

export default defaultReduceOptions;
