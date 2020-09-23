import { Observable } from 'rxjs';
import { IFilterExternalParams } from './external-params.interface';

export interface IFilterSavedFiltersConfig {
  load: FilterRemoteLoad;
  save: FilterRemoteSave;
  order: FilterRemoteOrder;
  delete: FilterRemoteDelete;
}

export interface IFilterSavedFilter {
  id?: number;
  name: string;
  active: boolean;
  filters: IFilterExternalParams;
}

export type FilterRemoteLoad = () => Observable<IFilterSavedFilter[]>;
export type FilterRemoteSave = (savedFilter: IFilterSavedFilter) => Observable<IFilterSavedFilter>;
export type FilterRemoteOrder = (savedFilters: IFilterSavedFilter[]) => Observable<IFilterSavedFilter[]>;
export type FilterRemoteDelete = (savedFilter: IFilterSavedFilter) => Observable<IFilterSavedFilter>;
