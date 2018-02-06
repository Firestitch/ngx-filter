import { FilterConfig } from './filterconfig.interface';

export class FsFilter {
    fsConfig: FilterConfig = {
      load: true,
      persist: false,
      inline: false,
      namespace: 'filter',
      items: []
    };
    constructor() {
    }
  }
