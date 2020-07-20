import { Injectable } from '@angular/core';

import { FsPersistanceStore } from '@firestitch/store';

import { FsFilterPersistance } from '../interfaces/config.interface';

const FILTER_STORE_KEY = 'fs-filter-persist';


@Injectable()
export class PersistanceStore extends FsPersistanceStore<FsFilterPersistance> {

  protected STORE_KEY = FILTER_STORE_KEY;

}
