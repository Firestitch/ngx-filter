import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { FilterConfig, FsFilterModule } from '@firestitch/filter';

import { FilterItemsService } from '../../services';


/**
 * Reproduces the query-param encoding bug in QueryParamController._replaceState.
 *
 * That method rewrites the address bar on every filter change, and its last
 * step decodes the whole query string so the `id:label` separator stays
 * readable as `:` instead of `%3A`. Because it re-reads the address bar it
 * wrote last time, the decode is not a one-off — it runs again on the next
 * change and strips another layer of encoding.
 *
 * `%25` is the escape for a literal `%`, so a label containing `#` decays
 * `%2523` -> `%23` -> `#` over two passes. At that point the `#` is a real
 * fragment marker: the label is truncated and every query param after it drops
 * out of the query string entirely.
 *
 * The User item is deliberately first and its labels carry a `#`; Status is
 * second so it is the param that gets swallowed.
 */
@Component({
  selector: 'query-param-encoding',
  templateUrl: './query-param-encoding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule],
})
export class QueryParamEncodingComponent {

  public readonly search = signal('');
  public readonly hash = signal('');
  public readonly broken = signal(false);
  /** What the filter hands back after parsing the URL — the round-trip result. */
  public readonly query = signal<string>('(none yet)');

  public conf: FilterConfig;

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _filterItems = inject(FilterItemsService);

  constructor() {
    this.conf = {
      chips: true,
      // Required: _replaceState only runs when the filter owns the query params.
      queryParam: true,
      persist: false,
      change: (query) => this.query.set(JSON.stringify(query)),
      init: (query) => this.query.set(JSON.stringify(query)),
      items: [
        this._filterItems.userAutocompleteWithId({ label: 'User (label carries #id)' }),
        this._filterItems.statusSelect({ multiple: false }),
        // Free text, so any character can be pushed through the round trip.
        this._filterItems.keyword({ label: 'Search (try & = # % , é)' }),
      ],
    };

    // history.replaceState fires no event, so poll to show the damage as it
    // happens rather than making the reader open devtools.
    const timer = setInterval(() => this._readUrl(), 250);
    this._destroyRef.onDestroy(() => clearInterval(timer));
    this._readUrl();
  }

  private _readUrl(): void {
    this.search.set(window.location.search || '(empty)');
    this.hash.set(window.location.hash || '(none)');
    // A fragment can only appear here if a decoded `#` escaped from a label.
    this.broken.set(!!window.location.hash);
  }
}
