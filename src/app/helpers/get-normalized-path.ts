import { Location } from '@angular/common';
import { removeQueryParams } from './remove-query-params';


export function getNormalizedPath(locationSrv: Location) {
  const path = locationSrv.prepareExternalUrl(locationSrv.path());

  return removeQueryParams(path);
}
