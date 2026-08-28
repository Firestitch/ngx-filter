import { inject, Injectable } from '@angular/core';

import { FsMessage } from '@firestitch/message';


/**
 * Every example wants the same thing out of a callback: a toast so the interaction is
 * visible on the page, and a console entry carrying the payload. Shared so no example has
 * to grow its own copy.
 */
@Injectable({ providedIn: 'root' })
export class ExampleLogService {

  private _message = inject(FsMessage);

  public log(message: string, ...args: unknown[]): void {
    this._message.info(message);
    // eslint-disable-next-line no-console
    console.log(message, ...args);
  }

}
