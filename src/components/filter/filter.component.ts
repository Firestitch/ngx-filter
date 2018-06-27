import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FsFilterConfig } from '../../models';
import { FsStore } from '@firestitch/store';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { FilterConfig } from '../../classes';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'fs-filter',
  styleUrls: [ './filter.component.scss' ],
  templateUrl: './filter.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
  @Input() public filter: FilterConfig = null;
  @Input() public sortUpdate: EventEmitter<any> = null;
  @Input() public showSortBy: any = true;
  @Input() public showFilterInput = true;

  public config: FsFilterConfig;
  public searchText = '';
  public persists = null;
  public activeFiltersCount = 0;
  public activeFiltersWithInputCount = 0;

  public showFilterMenu = false;

  public modelChanged = new EventEmitter();

  constructor(private _store: FsStore,
              private route: ActivatedRoute,
              private location: Location) {

  }

  public ngOnInit() {
    this.config = new FsFilterConfig(this.filter);
    this.restorePersistValues();

    this.config.initItems(this.filter.items, this.route, this.persists);

    // Set search input value after restore from STORE
    if (this.config.searchInput && this.config.searchInput.model) {
      this.searchText = this.config.searchInput.model;
    }

    // Count active filters after restore
    this.updateFilledCounter();

    this.watchSearchInput();

    if (this.sortUpdate) {
      this.sortUpdate.subscribe((data) => {
        this.config.updateSorting(data);
      });
    }

    this.config.init(this.config)
  }


  public watchSearchInput() {
    this.modelChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        // takeWhile(() => !this.destroyed)
      )
      .subscribe((value) => {
        this.config.searchInput.model = value;
        this.filterChange();
        this.change();
      })
  }

  public modelChange(text) {
    this.modelChanged.next(text);
  }

  public switchFilterVisibility() {
    this.changeVisibility(!this.showFilterMenu);
  }

  public changeVisibility(state: boolean) {
    this.showFilterMenu = state;
    if (this.showFilterMenu) {
      window.document.body.classList.add('fs-filters-open')
    } else {
      window.document.body.classList.remove('fs-filters-open');
      this.updateFilledCounter();
    }
  }

  public clearSearchInput() {
    this.searchText = '';
    if (this.config.searchInput) {
      this.config.searchInput.model = '';
    }
  }

  public clear() {
    this.searchText = '';
    this.config.filtersClear();
    this.activeFiltersCount = 0;
    this.activeFiltersWithInputCount = 0;
    this.filterChange();
    this.change();
    this.changeVisibility(false);
  }

  /**
   * Close filter window and do change callback
   */
  public search() {
    this.switchFilterVisibility();
    this.change();

    // Send event that sort has been updated
    if (this.config.sortChange) {
      this.config.sortChange(this.config);
    }
  }

  /**
   * Call change callback and apply new filter values
   */
  public change() {
    const query = this.config.gets({ flatten: true });
    // this.updateFilledCounter();

    if (this.config.change) {
      this.config.change(query, this.config);
    }
  }

  /**
   * Do update count of filled filters
   */
  public updateFilledCounter() {
    this.activeFiltersCount = this.config.countOfFilledItems();

    this.activeFiltersWithInputCount = (this.searchText !== '')
      ? this.activeFiltersCount + 1
      : this.activeFiltersCount;
  }

  /**
   * Store updated filter data into localstorage
   * @param {any} changedItem
   */
  public filterChange(changedItem = null) {
    if (changedItem && changedItem === this.config.searchInput) {
      this.searchText = changedItem.model;
    }

    if (this.config.persist) {
      this.persists[this.config.persist.name] = {
        data: this.config.gets({expand: true, names: false}),
        date: new Date()
      };
      this._store.set(this.config.namespace + '-persist', this.persists, {});
    }

    if (this.config.inline) {
      this.change();
    }
  }

  /**
   * Just reload with same values
   */
  public reload() {
    this.change();
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
        this.config.persist.name = this.location.path();
      }

      if (!this.persists[this.config.persist.name] || !this.persists[this.config.persist.name].data) {
        this.persists[this.config.persist.name] = {data: {}, date: new Date()};
      }

      if (this.config.persist.timeout) {

        const date = new Date(this.persists[this.config.persist.name].date);

        if (moment(date).subtract(this.config.persist.timeout, 'minutes').isAfter(moment())) {
          this.persists[this.config.persist.name] = {data: {}, date: new Date()};
        }
      }
    }
  }

  // public cancel() {
  //   this.switchFilterVisibility();
  // }
}
