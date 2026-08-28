import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { guid } from '@firestitch/common';
import {
  FilterComponent,
  FilterConfig,
  FilterSort,
  FilterStatusBarDirective,
  IFilterSavedFiltersConfig,
  SortItem,
} from '@firestitch/filter';
import { FsMenuModule } from '@firestitch/menu';

import { of } from 'rxjs';

import { ExampleLogService, ExampleUser, FilterItemsService } from '../../../services';

import { SavedFilters } from './saved-filter';


/**
 * Every item type at once, plus the parts of the filter that are not items at all: saved
 * filters, sorting, the status bar, auto-reload, and the imperative API the host page
 * drives from outside the bar.
 *
 * The individual item types each have their own focused example — this one exists to show
 * how a full bar behaves once it is carrying enough to overflow.
 */
@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterComponent,
    FilterStatusBarDirective,
    JsonPipe,
    FsMenuModule,
    MatButtonModule,
  ],
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

  public enabledFilters = true;
  public conf: FilterConfig;
  public query = null;
  public sort: FilterSort;

  public sorts: SortItem[] = [
    { name: 'Name', value: 'name' },
    { name: 'Date', value: 'date' },
  ];

  private _cdRef = inject(ChangeDetectorRef);
  private _filterItems = inject(FilterItemsService);
  private _log = inject(ExampleLogService);

  public ngOnInit(): void {
    this.conf = {
      chips: true,
      autofocus: false,
      // 6 so the chip row overflows and exercises one-at-a-time wrapping
      minSecondaryItems: 6,
      queryParam: true,
      persist: false,
      sort: {
        direction: 'desc',
        value: 'name',
      },
      autoReload: {
        enabled: true,
        seconds: 5,
      },
      reload: (query, sort) => this._apply('Reload', query, sort),
      change: (query, sort) => this._apply('Change', query, sort),
      init: (query, sort) => this._apply('Init', query, sort),
      sortChange: (query, sort) => this._apply('Sort change', query, sort),
      items: [
        this._filterItems.keyword(),
        this._filterItems.userSelect(),
        this._filterItems.statusSelect(),
        this._filterItems.subjectSelect(),
        this._filterItems.isolateSelect(),
        this._filterItems.showDeletedCheckbox(),
        this._filterItems.priceRange(),
        this._filterItems.userAutocomplete({ name: 'autocompleteUserId', label: 'Autocomplete User' }),
        this._filterItems.userAutocompleteChips({
          label: 'Autocomplete Chips',
          subTemplate: (user: ExampleUser) => user.title,
          template: (user: ExampleUser) => `${user.name}`,
        }),
        this._filterItems.weekdayChips(),
        this._filterItems.date(),
        this._filterItems.dateRange(),
        this._filterItems.monthRange(),
      ],
      savedFilters: this._savedFilters(),
    };
  }

  private _apply(event: string, query, sort: FilterSort): void {
    this._log.log(event, query, sort);
    this.query = query;
    this.sort = sort;
    this._cdRef.detectChanges();
  }

  /**
   * Stands in for a backend: save returns the record the server would have persisted,
   * complete with the id it would have assigned to a new one.
   */
  private _savedFilters(): IFilterSavedFiltersConfig {
    return {
      load: () => {
        this._log.log('Saved filters: load');

        return of(SavedFilters);
      },
      save: (savedFilter) => {
        const index = SavedFilters.findIndex((f) => f.id === savedFilter.id);

        if (index > -1) {
          SavedFilters[index] = savedFilter;
        } else {
          savedFilter = { ...savedFilter, id: guid() };
          SavedFilters.push(savedFilter);
        }

        this._log.log('Saved filters: save', savedFilter);

        return of(savedFilter);
      },
      order: (filters) => {
        this._log.log('Saved filters: order', filters);

        return of(null);
      },
      delete: (savedFilter) => {
        this._log.log('Saved filters: delete', savedFilter);

        return of(null);
      },
    };
  }
}
