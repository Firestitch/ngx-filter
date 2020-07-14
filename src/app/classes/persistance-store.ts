import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FsStore } from '@firestitch/store';

import { PersistanceStoreBase } from './persistance-store-base';
import { FsFilterPersistance } from '../interfaces/config.interface';

const FILTER_STORE_KEY = 'fs-filter-persist';


@Injectable()
export class PersistanceStore extends PersistanceStoreBase<FsFilterPersistance> {

  protected STORE_KEY = FILTER_STORE_KEY;

}
