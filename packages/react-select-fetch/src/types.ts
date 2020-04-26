import type {
  OptionsList,
  Response,
} from 'react-select-async-paginate';

export type Additional = {
  page: number;
};

export type MapResponsePayload<OptionType = any> = {
  search: string;
  prevPage: number;
  prevOptions: OptionsList<OptionType>;
};

export type MapResponse<OptionType = any> = (
  responseRaw: any,
  payload: MapResponsePayload<OptionType>,
) => Response<OptionType, Additional>;

export type Get = (
  url: string,
  params: {
    [key: string]: any;
  },
) => any;

export type UseSelectFetchParams<OptionType = any> = {
  url: string;
  queryParams?: {
    [key: string]: any;
  };
  searchParamName?: string;
  pageParamName?: string;
  offsetParamName?: string;
  mapResponse?: MapResponse<OptionType>;
  get?: Get;
};
