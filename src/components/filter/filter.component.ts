import { Component, Input, OnInit } from '@angular/core';
import { FsFilterConfig } from '../../models';
import { IFilterConfigItem } from '../../classes';
import { FsStore } from '@firestitch/store';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { FilterConfig } from '../../classes/filterconfig.interface';


@Component({
  selector: 'filter',
  styleUrls: [ './filter.component.scss' ],
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {
  @Input() filter: FilterConfig = null;

  public config: FsFilterConfig;
  public searchText = '';
  public persists = null;

  public showFilterMenu = false;

  constructor(private _store: FsStore,
              private route: ActivatedRoute,
              private location: Location) {

  }

  public ngOnInit() {
    this.config = new FsFilterConfig(this.filter);
    this.restorePersistValues();

    this.config.initItems(this.filter.items, this.route, this.persists);
  }

  public modelChange(text) {

  }

  public switchFilterVisibility() {
    this.showFilterMenu = !this.showFilterMenu;
    if (this.showFilterMenu) {
      window.document.body.classList.add('fs-filters-open')
    } else {
      window.document.body.classList.remove('fs-filters-open');
    }
  }

  public clear() {
    this.config.filtersClear();
  }

  public search() {
    this.switchFilterVisibility();

    if (this.config.change) {
      const query = this.config.gets({ flatten: true });
      this.config.change(query, this.config);
    }
  }

  public filterChange(event) {
    console.log(event);
    if (this.config.persist) {
      this.persists[this.config.persist.name] = {
        data: this.config.gets({expand: true, names: false}),
        date: new Date()
      };
      this._store.set(this.config.namespace + '-persist', this.persists, {});
    }
  }

  public reload() {
  }

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

  public cancel() {
    this.switchFilterVisibility();
  }
}
