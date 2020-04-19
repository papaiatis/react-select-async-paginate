import type {
  ShouldLoadMore,
} from './types';

const AVAILABLE_DELTA: number = 10;

const defaultShouldLoadMore: ShouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
  const bottomBorder = scrollHeight - clientHeight - AVAILABLE_DELTA;

  return bottomBorder < scrollTop;
};

export default defaultShouldLoadMore;
