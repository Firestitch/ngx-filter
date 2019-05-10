import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FsStore } from '@firestitch/store';

import { cloneDeep } from 'lodash-es';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { isAfter, subMinutes } from 'date-fns';

import { FsFilterConfig } from '../../models/filter-config';
import { FilterConfig } from '../../interfaces/config.interface';
import { FsFilterConfigItem } from '../../models/filter-item';
import { objectsAreEquals } from '../../helpers/compare';
import { QueryParams } from '../../models/query-params';


@Component({
  selector: 'fs-filter',
  styleUrls: [ './filter.component.scss' ],
  templateUrl: './filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() public filter: FilterConfig = null;
  @Input() public sortUpdate: EventEmitter<any> = null;
  @Input() public showSortBy: any = true;
  @Input() public showFilterInput = true;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.code === 'Escape' && this.showFilterMenu) {
      this.changeVisibility(false);
    }
  }

  @ViewChild('searchTextInput')
  set searchTextInput(value) {
    this._searchTextInput = value;
  }

  public changedFilters = [];
  public config: FsFilterConfig;
  public searchText = '';
  public persists = null;
  public activeFiltersCount = 0;
  public activeFiltersWithInputCount = 0;
  public showFilterMenu = false;
  public modelChanged = new EventEmitter();

  private _searchTextInput: ElementRef = null;
  private _firstOpen = true;
  private _query = {};
  private _queryParams: QueryParams;
  private _sort = {};

  constructor(
    private _store: FsStore,
    private _location: Location,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {

  }

  public ngOnInit() {
    this.config = new FsFilterConfig(this.filter);
    this.restorePersistValues();
    this.config.initItems(this.filter.items, this._route, this.persists);

    if (this.config.queryParam) {
      this._queryParams = new QueryParams(this._router, this._route, this.config.items);
    }

    // Set search input value after restore from STORE
    this.updateSearchText();

    // Count active filters after restore
    this.updateFilledCounter();

    this.watchSearchInput();

    if (this.sortUpdate) {
      this.sortUpdate
        .pipe(
          takeUntil(this.config.destroy$),
        )
        .subscribe((data) => {
          this.config.updateSort(data);
        });
    }

    if (this.config.init) {
      this.fireInitCallback();
    }

    // Avoid ngChanges error
    setTimeout(() => {
      if (this._searchTextInput && this.config.autofocus) {
         this._searchTextInput.nativeElement.focus();
       }
    });
  }

  public ngOnDestroy() {
    if (this.config) {
      this.config.destroy();
    }
  }

  /**
   *
   * Do update value of some field
   *
   * @param {any} values - values for update
   * @param {boolean} changeEvent - should change event to be fired
   *
   * To update text value just pass new text value
   *
   * public updateSelectValue(val) {
   *   this.filterEl.updateValues({ keyword: val });
   * }
   *
   * To update select or observable select you could pass suitable value
   *
   * public updateSelectValue(val: number) {
   *   this.filterEl.updateValues({ simple_select: val }, { observable_select: val });
   * }
   *
   * To update checkbox value just pass true/false as value
   *
   * public updateCheckox(val: boolean) {
   *   this.filterEl.updateValues({ checkbox: val });
   * }
   *
   * To update range value just pass object with min&max object or just with one of targets
   *
   * Ex.: { min: 10, max 15 }, { min: 5 }, { max 5 }
   *
   * public updateRange(val) {
   *   this.filterEl.updateValues({ range: val });
   * }
   *
   * To update autocomplete just pass object with name/value fields
   *
   * Ex.: { name: 'John Doe', value: 1 }
   *
   * public updateAutocomplete(val) {
   *   this.filterEl.updateValues({ autocomplete_user_id: val });
   * }
   *
   * To update autocompletechips just pass:
   *
   * 1) object with name/value fields - will be appended to existing set of values
   *
   * { name: 'John Doe', value: 1 }
   *
   * 2) array of objects - will be appended to existing set of values
   *
   * [{ name: 'John Doe', value: 1 }, { name: 'Darya Filipova', value: 2 }]
   *
   * 3) null - clear existing set of values
   *
   * public updateAutocomplete(val) {
   *   this.filterEl.updateValues({ autocompletechips_user_id: val });
   * }
   *
   */
  public updateValues(values, changeEvent = true) {
    Object.keys(values).forEach((key) => {
      const filterItem = this.config.items.find((item) => item.name === key);

      if (!filterItem) {
        return;
      }

      filterItem.updateValue(values[key]);

      if (filterItem === this.config.searchInput) {
        this.updateSearchText();
      }
    });

    this.updateFilledCounter();

    if (changeEvent) {
      this.filterChange();
    }
  }

  public watchSearchInput() {
    this.modelChanged
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        takeUntil(this.config.destroy$),
      )
      .subscribe((value) => {
        this.config.searchInput.model = value;
        this.filterChange();
      })
  }

  public modelChange(text) {
    this.modelChanged.next(text);
  }

  public backdropClick(event) {
    this.switchFilterVisibility(event);
  }

  public done() {
    this.changeVisibility(false);
  }

  public switchFilterVisibility(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this.changeVisibility(!this.showFilterMenu);
  }

  public filterInputClick(event: KeyboardEvent) {

    if (['Enter', 'NumpadEnter', 'Escape'].indexOf(event.code) >= 0) {
      return this.changeVisibility(false);
    }

    this.changeVisibility(true);
  }

  public changeVisibility(state: boolean) {
    this.showFilterMenu = state;

    if (this._firstOpen) {
      this.config.loadValuesForPendingItems();
      this._firstOpen = false;
    }

    if (this.showFilterMenu) {
      window.document.body.classList.add('fs-filter-open');
    } else {
      window.document.body.classList.remove('fs-filter-open');
      this.updateFilledCounter();
    }
  }

  public clear(event = null) {

    if (event) {
      event.stopPropagation();
    }

    if (this.config.searchInput) {
      this.config.searchInput.model = '';
      this.modelChange(this.config.searchInput.model);
    }

    this.searchText = '';
    this.changedFilters = [];
    this.config.filtersClear();
    this.activeFiltersCount = 0;
    this.activeFiltersWithInputCount = 0;
    this.filterChange();
    this.changeVisibility(false);
  }

  /**
   * Close filter window and do change callback
   */
  public search() {
    this.switchFilterVisibility();
    this.filterChange();
  }

  /**
   * Call change callback and apply new filter values
   */
  public change() {

    this.config.updateModelValues();
    const query = this.config.gets({ flatten: true });
    const sort = this.config.getSort();

    const queryChanged = !objectsAreEquals(this._query, query);

    if (queryChanged) {
      this._query = query;

      this.storePersistValues();
      this.updateFilledCounter();

      if (this.config.change) {
        this.config.change(cloneDeep(query), sort);
      }

      if (this.config.queryParam) {
        this._queryParams.updateQueryParams(query);
      }
    }

    const sortingChanged = ((!sort || !this._sort) && sort !== this._sort)
      || (sort && this._sort && !objectsAreEquals(this._sort, sort));

    if (sortingChanged) {
      this._sort = sort;

      if (this.config.sortChange) {
        this.config.sortChange(cloneDeep(query), sort);
      }
    }
  }

  /**
   * Do update count of filled filters
   */
  public updateFilledCounter() {
    this.changedFilters = this.config.getFilledItems();

    this.changedFilters
      .filter((item) => item.hasPendingValues)
      .forEach((item) => item.loadValues(false));

    this.activeFiltersWithInputCount = (this.searchText !== '')
      ? this.changedFilters.length + 1
      : this.changedFilters.length;
  }

  /**
   * Store updated filter data into localstorage
   * @param changedItem
   */
  public filterChange(changedItem: FsFilterConfigItem = null) {

    if (changedItem) {
      if (changedItem === this.config.searchInput) {
        this.searchText = changedItem.model;
      }

      changedItem.checkIfValueChanged();
    }

    this.storePersistValues();
    this.change();
  }

  /**
   * Just reload with same values
   */
  public reload(event) {
    event.stopPropagation();

    const query = this.config.gets({ flatten: true });

    if (this.config.reload) {
      this.config.reload(cloneDeep(query), this.config.getSort());
    }
  }

  /**
   * Restoring values from local storage
   */
  public restorePersistValues() {
    this.persists = this._store.get(this.config.namespace + '-persist', {});

    if (this.persists === undefined) {
      this.persists = {};
    }

    if (this.config.persist) {

      if (typeof this.config.persist.persist !== 'object') {
        this.config.persist = {name: this.config.persist};
      }

      if (!this.config.persist.name) {
        this.config.persist.name = this._location.path();
      }

      if (!this.persists[this.config.persist.name] || !this.persists[this.config.persist.name].data) {
        this.persists[this.config.persist.name] = {data: {}, date: new Date()};
      }

      if (this.config.persist.timeout) {

        const date = new Date(this.persists[this.config.persist.name].date);

        if (isAfter(subMinutes(date, this.config.persist.timeout), new Date())) {
          this.persists[this.config.persist.name] = {data: {}, date: new Date()};
        }
      }
    }
  }

  /**
   * Store values to local storage
   */
  public storePersistValues() {
    if (this.config.persist) {
      this.persists[this.config.persist.name] = {
        data: this.config.gets({expand: true, names: false}),
        date: new Date()
      };

      this._store.set(this.config.namespace + '-persist', this.persists, {});
    }
  }

  /**
   * Reset filter
   * @param item
   */
  public resetFilter(item: FsFilterConfigItem) {
    const index = this.changedFilters.indexOf(item);

    if (index > -1) {
      this.changedFilters.splice(index, 1);
      item.clear();
    }

    this.change();
  }


  private updateSearchText() {
    if (this.config.searchInput && this.config.searchInput.model) {
      this.searchText = this.config.searchInput.model;
    }
  }

  private fireInitCallback() {
    this._query = this.config.gets({ flatten: true });
    this._sort = this.config.getSort();

    this.config.init(this._query, this.config.getSort());
  }
}
