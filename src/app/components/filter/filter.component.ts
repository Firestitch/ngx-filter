import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  ApplicationRef,
  Injector
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FsStore } from '@firestitch/store';

import { cloneDeep } from 'lodash-es';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { isAfter, subMinutes } from 'date-fns';

import { FsFilterConfig } from '../../models/filter-config';
import { FsFilterConfigItem, ItemType } from '../../models/filter-item';
import { objectsAreEquals } from '../../helpers/compare';
import { QueryParams } from '../../models/query-params';
import { FsDocumentScrollService } from '@firestitch/scroll';
import { FsFilterOverlayService } from '../../services/filter-overlay.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'fs-filter',
  styleUrls: [ './filter.component.scss' ],
  templateUrl: './filter.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    FsFilterOverlayService,
  ]
})
export class FilterComponent implements OnInit, OnDestroy {

  protected _config: FsFilterConfig = null;

  @Input('config') set setConfig(config) {
    this.config = config;
  }

  @Input('filter') set setFilter(config) {
    this.config = config;
  }

  @Input() public sortUpdate: EventEmitter<any> = null;
  @Input() public showSortBy: any = true;
  @Input() public showFilterInput = true;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Escape' && this.showFilterMenu) {
      this.changeVisibility(false);
    }
  }

  @HostListener('window:resize')
  updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  @ViewChild('searchTextInput')
  set searchTextInput(value) {
    this._searchTextInput = value;
  }

  public changedFilters = [];
  public searchText = '';
  public persists = null;
  public activeFiltersCount = 0;
  public activeFiltersWithInputCount = 0;
  public showFilterMenu = false;
  public modelChanged = new EventEmitter();
  public windowDesktop = false;

  private _filterDrawerRef;
  private _searchTextInput: ElementRef = null;
  private _firstOpen = true;
  private _query = {};
  private _queryParams: QueryParams;
  private _sort = {};
  private _destroy$ = new Subject();

  constructor(
    private _store: FsStore,
    private _location: Location,
    private _route: ActivatedRoute,
    private _router: Router,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _documentScrollService: FsDocumentScrollService,
    private _filterOverlay: FsFilterOverlayService,
  ) {
    this.updateWindowWidth();

    this._filterOverlay.attach$
    .pipe(
     takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this.showFilterMenu = true;
    });

    this._filterOverlay.detach$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this.updateFilledCounter();
      this.showFilterMenu = false;
    });
  }

  public set config(config) {
    this._config = new FsFilterConfig(config);
    this.restorePersistValues();
    this.config.initItems(config.items, this._route, this.persists);

    if (this.config.queryParam) {
      this._queryParams = new QueryParams(this._router, this._route, this.config.items);
    }

    // Count active filters after restore
    this.updateFilledCounter();
  }

  public get config() {
    return this._config;
  }

  public ngOnInit() {

    // Avoid ngChanges error
    setTimeout(() => {
      this.focus();
    });

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
      this.init();
    }
  }

  public focus() {
    if (this._searchTextInput && this.config.autofocus) {
      this._searchTextInput.nativeElement.focus();
    }
  }

  public ngOnDestroy() {

    this.destroyFilterDrawer();
    this._destroy$.next();
    this._destroy$.complete();

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
    });

    this.updateFilledCounter();

    if (changeEvent) {
      this.filterChange();
    }
  }

  public modelChange(text) {
    this.modelChanged.next(text);
  }

  public hide() {
    this.changeVisibility(false);
  }

  public show() {
    this.changeVisibility(true);
  }

  public changeVisibilityClick(value, event = null) {

    if (event) {
      event.stopPropagation();
    }

    this.changeVisibility(value);
  }

  public filterInputEvent(event: KeyboardEvent) {

    if (!this.windowDesktop) {
      return;
    }

    if (['Enter', 'NumpadEnter', 'Escape'].indexOf(event.code) >= 0) {
      return this.changeVisibility(false);
    }

    this.changeVisibility(true);
  }

  public changeVisibility(state: boolean) {

    if (state === this.showFilterMenu) {
      return;
    }

    if (!state) {
      return this.destroyFilterDrawer();
    }

    const notTextItem = this.config.items.find((item, index) => {
      return item.type !== ItemType.Keyword;
    });

    if (!notTextItem) {
      return;
    }

    this._filterOverlay.open(this._injector,  {
      items: this.config.items,
      showSortBy: 'showSortBy',
      sortBy: this.config.sortByItem,
      sortDirection: this.config.sortDirectionItem,
      filterChanged: this.filterChange.bind(this),
      search: this.search.bind(this),
      done: this.hide.bind(this),
      clear: this.clear.bind(this)
    });

    if (this._firstOpen) {
      this.config.loadValuesForPendingItems();
      this._firstOpen = false;
    }
  }

  public clearSearchText(event) {
    event.stopPropagation();
    this.searchText = '';
    this.modelChanged.next('');
  }

  public init() {
    this._query = this.config.gets({ flatten: true });
    this._sort = this.config.getSort();

    this.config.init(this._query, this.config.getSort());
  }

  public clear(event = null) {

    if (event) {
      event.stopPropagation();
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
  public search(event) {
    this.changeVisibilityClick(false, event);
    this.filterChange();
  }

  public reload(event = null) {

    if (event) {
      event.stopPropagation();
    }

    const query = this.config.gets({ flatten: true });

    if (this.config.reload) {
      this.config.reload(cloneDeep(query), this.config.getSort());
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

  /**
   * Call change callback and apply new filter values
   */
  public change() {

    this.config.updateModelValues();
    const query = this.config.gets({ flatten: true });
    const sort = this.config.getSort();

    const sortingChanged = ((!sort || !this._sort) && sort !== this._sort)
      || (sort && this._sort && !objectsAreEquals(this._sort, sort));

    if (sortingChanged) {
      this._sort = sort;

      if (this.config.sortChange) {
        this.config.sortChange(cloneDeep(query), sort);
      }
    }

    // This should be an option or a done with an wrapping helper function
    // because it restricts functionality ie. reload
    //const queryChanged = !objectsAreEquals(this._query, query);
    //if (queryChanged) {

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

  /**
   * Do update count of filled filters
   */
  private updateFilledCounter() {
    debugger;
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
  private filterChange(changedItem: FsFilterConfigItem = null) {

    if (changedItem) {
      // if (changedItem === this.config.searchInput) {
      //   this.searchText = changedItem.model;
      // }

      changedItem.checkIfValueChanged();
    }

    this.storePersistValues();
    this.change();
  }

  private destroyFilterDrawer() {
    this._filterOverlay.close();
  }

  private watchSearchInput() {
    this.modelChanged
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        takeUntil(this.config.destroy$),
      )
      .subscribe((value) => {

        const textItem = this.config.items.find((item) => item.type === ItemType.Keyword);

        if (textItem) {
          textItem.model = value;
        }

        this.filterChange();
      })
  }

  /**
   * Restoring values from local storage
   */
  private restorePersistValues() {
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
  private storePersistValues() {
    if (this.config.persist) {
      this.persists[this.config.persist.name] = {
        data: this.config.gets({expand: true, names: false}),
        date: new Date()
      };

      this._store.set(this.config.namespace + '-persist', this.persists, {});
    }
  }
}
