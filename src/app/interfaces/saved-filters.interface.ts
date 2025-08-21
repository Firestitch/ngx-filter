import { Observable } from 'rxjs';

import { KeyValue } from './external-params.interface';

export interface IFilterSavedFiltersConfig {
  load: FilterRemoteLoad;
  save: FilterRemoteSave;
  order?: FilterRemoteOrder;
  delete: FilterRemoteDelete;
  label?: {
    singular: string;
    plural: string;
    icon?: string;
  };
}

export interface IFilterSavedFilter {
  id?: string|number;
  name?: string;
  active?: boolean;
  filters?: KeyValue;
}

export type FilterRemoteLoad = () => Observable<IFilterSavedFilter[]>;
export type FilterRemoteSave = (savedFilter: IFilterSavedFilter) => Observable<IFilterSavedFilter>;
export type FilterRemoteOrder = (savedFilters: IFilterSavedFilter[]) => Observable<IFilterSavedFilter[]>;
export type FilterRemoteDelete = (savedFilter: IFilterSavedFilter) => Observable<IFilterSavedFilter>;
