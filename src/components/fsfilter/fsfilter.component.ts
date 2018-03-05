import {Component, ViewEncapsulation, Input, OnInit, OnDestroy} from '@angular/core';
import {isObject, isArray, toString} from 'lodash';
import {isEmpty} from '@firestitch/common/util';
import {filter as arrayFilter, list as arrayList, remove as arrayRemove} from '@firestitch/common/array';
import {FsStore} from '@firestitch/store';
import {FsFilter} from './../../classes';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import moment from 'moment-timezone';
import {Location} from '@angular/common';

@Component({
  selector: 'fs-filter',
  templateUrl: './fsfilter.component.html',
  styleUrls: ['./fsfilter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FsFilterComponent implements OnInit, OnDestroy {

  @Input() filter: FsFilter = null;
  searchinput = {value: ''};
  extended_filter = false;
  filterChange = false;
  primary = false;
  persists = null;

  constructor(private FsStore: FsStore, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {

    this.persists = this.FsStore.get(this.filter.fsConfig.namespace + '-persist', {});

    if (this.persists === undefined) {
      this.persists = {};
    }

    if (this.filter.fsConfig.persist) {

      if (typeof this.filter.fsConfig.persist.persist !== 'object') {
        this.filter.fsConfig.persist = {name: this.filter.fsConfig.persist};
      }

      if (!this.filter.fsConfig.persist.name) {
        this.filter.fsConfig.persist.name = this.location.path();
      }

      if (!this.persists[this.filter.fsConfig.persist.name] || !this.persists[this.filter.fsConfig.persist.name]['data']) {
        this.persists[this.filter.fsConfig.persist.name] = {data: {}, date: new Date()};
      }

      if (this.filter.fsConfig.persist.timeout) {

        let date = new Date(this.persists[this.filter.fsConfig.persist.name]['date']);

        if (moment(date).subtract(this.filter.fsConfig.persist.timeout, 'minutes').isAfter(moment())) {
          this.persists[this.filter.fsConfig.persist.name] = {data: {}, date: new Date()};
        }
      }
    }

    // preload any filters which have filter.wait.  Once they are all loaded then proceed to load main data & rest of filters.
    let wait_observables$ = [], update_observables$ = [];
    for (let filter of this.filter.fsConfig.items) {

      if (filter.name && isObject(filter.name)) {
        filter.names = filter.name;
        filter.name = Object.keys(filter.names).join('-');
      }

      if (this.filter.fsConfig.persist) {

        let persisted = this.persists[this.filter.fsConfig.persist.name]['data'];

        if (persisted[filter.name]) {

          let value = persisted[filter.name];

          if (value) {
            if (filter.type == 'daterange' || filter.type == 'datetimerange') {
              value.from = value.from ? moment.utc(value.from) : null;
              value.to = value.to ? moment.utc(value.to) : null;

            } else if (filter.type.match(/^date/)) {
              value = moment(value);
            }
          }

          filter.model = value;
        }
      }

      if (filter.query) {

        let query = this.route.snapshot.queryParams[filter.query];

        if (query !== undefined) {
          query += '';
          filter.model = query;

          if (!query.length) {
            filter.model = undefined;
          } else if (filter.type == 'select' && filter.multiple) {
            filter.model = filter.model.split(',');
          } else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
            let parts = filter.model.split(',');
            filter.model = {from: moment(parts[0]), to: moment(parts[1])};
          } else if (filter.type == 'range') {
            let parts = filter.model.split(',');
            filter.model = {min: parts[0], max: parts[1]};
          }
        }
      }

      if (typeof filter.values == 'function' && !filter.type.match(/^autocomplete/)) {
        filter.values = filter.values();
      }

      let observable$ = this.sanitizeFilter(filter);
      if (filter.wait || (filter.type == 'select' && filter.isolate && filter.wait === undefined)) {
        wait_observables$.push(observable$);
      } else {
        update_observables$.push(observable$);
      }
    }
    ;

    Observable.forkJoin(wait_observables$)
      .subscribe(
        () => {
        },
        () => {
        },
        () => {

          if (this.filter.fsConfig.load) {
            this.reload({filterUpdate: false});
          }

          Observable.forkJoin(update_observables$)
            .subscribe(
              () => {
              },
              () => {
              },
              () => {
                if (this.filter.fsConfig.init) {
                  this.filter.fsConfig.init(this);
                }
                this.filterUpdate();
              });
        });
    console.log(this.filter.fsConfig.items);
  }

  menuFilterChange(search) {

    let text = '';

    for (let filter of this.filter.fsConfig.items) {
      if (filter.type == 'text') {

        text = search.match(new RegExp('(' + filter.label + ':$)', 'i'));
        if (text) {
          search = search.replace(text[1], '');
        }

        // Wrap text with spaces in brackets
        text = search.match(new RegExp(filter.label + ':([^:\(\)]+)($|\s[\(\w\s]+:)', 'i'));
        if (text) {
          search = search.replace(text[1], '(' + text[1] + ')');
        }
      }
    }

    let matches = search.match(/(\([^\)]+\):\([^\)]+\)|\([^\)]+\):[^\s]+|[^:]+:\([^\)]+\)|[^\s]+)/g) || [];
    let values = {};
    let textSearch = [];
    for (let match of matches) {

      let filter_match = match.trim().match(/\(?([^:\)]+)\)?:\(?([^)]+)/);

      if (filter_match) {
        values[filter_match[1].trim()] = filter_match[2];
      } else {
        textSearch.push(match);
      }
    }
    ;

    this.filtersClear();

    for (let filter of this.filter.fsConfig.items) {
      if (filter.type == 'text' && filter.primary) {
        filter.model = textSearch.join(' ');
      }
    }
    ;

    for (let label in values) {

      if (!values[label]) {
        continue;
      }
      let filter = arrayFilter(this.filter.fsConfig.items, {label: label})[0];

      if (filter) {

        if (filter.type == 'date' || filter.type == 'datetime') {

          let date = Date.parse(values[label]);

          if (date) {
            filter.model = moment(date);
          }

        } else if (filter.type == 'daterange') {

          let parts = values[label].split(/\s+to\s+/);
          let from = Date.parse(parts[0]);
          let to = Date.parse(parts[1]);

          filter.model = {};

          if (from) {
            filter.model.from = from;
          }

          if (to) {
            filter.model.to = to;
          }

        } else if (filter.type == 'range') {
          let parts = values[label].split(',');
          filter.model = {min: parts[0], max: parts[1]};

        } else if (filter.type == 'select') {

          if (filter.multiple) {

            let values = [];
            for (let value of values[label].split(',')) {

              let item = arrayFilter(filter.values, {name: value})[0];

              if (item) {
                values.push(item.value);
              }
            }
            ;

            filter.model = values;

          } else {

            let item = arrayFilter(filter.values, {name: values[label]})[0];

            if (item) {
              filter.model = item.value;
            }
          }

        } else if (filter.type == 'checkbox') {
          filter.model = (values[label] == 'Yes') ? filter.checked : filter.unchecked;
        } else {
          filter.model = values[label];
        }
      }
    }
    ;

    this.reload({filterUpdate: false});
  }

  filtersClear() {
    for (let filter of this.filter.fsConfig.items) {
      filter.model = undefined;
      if (filter.type == 'autocomplete') {
        filter.model = null;
        filter.search = '';
      } else if (filter.type == 'autocompletechips') {
        filter.model = [];
        filter.search = '';
      } else if (filter.type == 'select' && filter.isolate) {
        filter.model = null;
        filter.isolate.enabled = false;
      } else if (filter.type == 'checkbox') {
        filter.model = filter.unchecked;
      } else if (filter.type == 'range') {
        filter.model = {};
      }
    }
    ;
  }

  menuFilterClick($event) {

    if (window.innerWidth >= 600) {

      this.filterUpdate();

      if (window.getSelection && window.getSelection().toString()) {
        const selected = window.getSelection().toString();

        if (selected) {
          setTimeout(function () {
            const index = $event.target.value.indexOf(selected);
            if (index >= 0) {
              $event.target.setSelectionRange(index, index + selected.length);
            }
          });
        }
      }

      this.menuFilterShow();
    }
  }

  menuFilterKeydown($event) {
    this.filterToggle($event.keyCode !== 13);
  }

  menuFilterShow() {
    this.filterToggle(true);
  }

  clear() {
    this.filtersClear();
    this.filterUpdate();
  }

  reload(opts?) {
    return this.load(Object.assign({}, {clear: true}, opts));
  }

  load(opts = {}) {

    if (opts['filterUpdate'] !== false) {
      this.filterUpdate();
    }

    const query = this.gets({flatten: true});

    if (this.filter.fsConfig.persist) {
      this.persists[this.filter.fsConfig.persist.name] = {
        data: this.gets({expand: true, names: false}),
        date: new Date()
      };
      this.FsStore.set(this.filter.fsConfig.namespace + '-persist', this.persists, {});
    }

    if (this.filter.fsConfig.change) {
      this.filter.fsConfig.change(query, this);
    }
  }

  filterToggle(value, search?) {

    this.extended_filter = value;

    setTimeout(function () {
      const body = document.body;

      value ? body.classList.add('fs-filters-open') : body.classList.remove('fs-filters-open');
    });

    if (search && !value && this.filterChange) {
      this.reload();
    }

    if (value) {
      this.filterChange = false;
    }

    this.filterUpdate();
  }

  onFilterChange(filter, $event?) {

    this.filterChange = true;

    if (this.filter.fsConfig.inline) {
      this.load();
    }
  }

  onAutocompleteChange(filter, $event?) {

    if (isObject(filter.model)) {
      this.onFilterChange(filter);
    } else {
      filter.values$ = filter.values(filter.model);
    }
  }

  onAutocompleteChipsChange(filter, input) {
    if (!isObject(filter.selectedValue)) {
      filter.values$ = filter.values(filter.selectedValue)
        .map(values => {
          const selected = arrayList(filter.model, 'value');
          return arrayFilter(values, (value) => {
            return (<any[]>selected).indexOf(value.value) === -1;
          });
        });
    } else {
      input.value = '';
    }
  }

  removeAutucompleteChipItem(filter, item) {
    arrayRemove(filter.model, {value: item.value});
    this.onFilterChange(filter);
  }

  addAutucompleteChipItem(filter, $event) {
    filter.model.push($event.option.value);
    this.onFilterChange(filter);
  }

  filterKeyup(filter, $event) {
    if (filter.type == 'text' || filter.type == 'select') {
      if ($event.keyCode == 13) {
        setTimeout(function () {
          this.onFilterChange(filter);
          this.filterToggle(false, true);
        });
      }
    }
  }

  filterUpdate() {
    let label, formatted, searches = [];

    for (let filter of this.filter.fsConfig.items) {

      let value = this.copy(filter.model);

      if (filter.type === 'select') {

        if (filter.multiple) {

          if (!isArray(value) || !value.length) {
            continue;
          }

          let values = [];
          for (let item of value) {
            for (let filter_item of filter.values) {
              if (!String(filter_item.value).localeCompare(String(item))) {
                values.push(filter_item.name);
              }
            }
          }

          value = values.join(',');

        } else {

          if (value == '__all' || value === null || value === undefined) {
            continue;
          }

          for (let filter_item of filter.values) {
            if (!String(filter_item.value).localeCompare(String(value))) {
              value = filter_item.name;
            }
          }
        }

        if (filter.isolate) {

          if (filter.isolate.enabled) {
            value = filter.isolate.label;
          }
        }
      }

      if (isEmpty(value, {zero: true})) {
        continue;
      }

      if (filter.type == 'autocomplete') {
        value = filter.model.name;

      } else if (filter.type == 'autocompletechips') {

        if (!isArray(filter.model) || !filter.model.length) {
          continue;
        }

        let values = [];
        for (let item of filter.model) {
          values.push(item.name);
        }

        value = values.join(',');

      } else if (filter.type == 'date' || filter.type == 'datetime') {

        let format = 'MMM D, YYYY';

        if (filter.type == 'datetime') {
          format += ' h:mm a';
        }

        value = moment(value);

        if (!value) {
          continue;
        }

        value = value.format(format);

      } else if (filter.type == 'daterange' || filter.type == 'datetimerange') {

        if (value) {
          let from = moment(value.from);
          let to = moment(value.to);
          let format = filter.type == 'datetimerange' ? 'MMM D, YYYY h:mm a' : 'MMM D, YYYY';
          value = [];

          if (from) {
            value.push(from.format(format));
          }

          if (to) {
            value.push(to.format(format));
          }

          value = value.join(' to ');
        }

      } else if (filter.type == 'checkbox') {

        if (filter.model == filter.unchecked) {
          return;
        } else {
          value = 'Yes';
        }

      } else if (filter.type == 'range') {

        let min = value['min'];
        let max = value['max'];

        let parts = [];
        if (min) {
          parts.push(min);
        }

        if (max) {
          parts.push(max);
        }

        value = parts;
      }

      value = String(value);

      if (filter.alias) {
        label = filter.alias.match(/\s/) ? '(' + filter.alias + ')' : filter.alias;
      } else {
        label = filter.label.match(/\s/) ? '(' + filter.label + ')' : filter.label;
      }

      formatted = label + ':' + (value.match(/\s/) ? '(' + value + ')' : value);
      searches.push({
        value: value,
        type: filter.type,
        formatted: formatted
      });
    }
    ;

    this.searchinput.value = '';
    if (searches.length === 1 && searches[0].type == 'text') {
      this.searchinput.value = searches[0].value;
    } else {
      for (let search of searches) {
        this.searchinput.value += search.formatted + ' ';
      }

      this.searchinput.value = this.searchinput.value.trim();
    }
  }

  sanitizeFilter(filter) {

    const observable$ = new Observable((observer) => {
      if (filter.values && typeof filter.values == 'object' && filter.values instanceof Observable) {
        filter.values.subscribe(
          (values) => {
            observer.next(values);
            observer.complete();
          }
        );
      } else {
        observer.next(filter.values);
        observer.complete();
      }
    });

    const $subscriber = observable$.subscribe((values) => {

      if (filter.primary) {
        this.primary = true;
      } else {
        filter.primary = false;
      }

      if (filter.type == 'checkbox') {

        filter.checked = toString(filter.checked);
        filter.unchecked = toString(filter.unchecked);
        filter.default = filter.default === undefined ? filter.unchecked : toString(filter.default);
      } else if (filter.type == 'text') {

        if (!this.primary) {
          filter.primary = this.primary = true;
        }
      } else if (filter.type == 'range') {

        if (!filter.placeholder) {
          filter.placeholder = ['Min', 'Max'];
        }

        if (!filter.model) {
          filter.model = {};
        }

      } else if (filter.type == 'select') {

        filter.values = values;
        filter.groups = null;

        let data = [];
        if (filter.nested) {
          // generate a list of values from objects that have not been nested.
          if (!filter.multiple) {
            data.push({value: '__all', name: 'All', depth: 0});
          }

          Array.prototype.push.apply(data, this.walkSelectNestedValues(filter, null, filter.values));
        } else {

          data = this.walkSelectValues(filter, filter.values);
        }

        filter.values = data;

        if (filter.isolate) {

          for (let index in filter.values) {

            if (!filter.values[index]) {
              continue;
            }

            if (filter.values[index].value == filter.isolate.value) {
              filter.values.splice(index, 1);
            }
          }
          ;

          if (isArray(filter.model)) {
            if (filter.model.length == filter.values.length) {
              filter.model = null;
              filter.isolate.enabled = false;
            } else if (filter.model[0] == filter.isolate.value) {
              filter.isolate.enabled = true;
            }
          }
        }

        for (let value of filter.values) {

          if (value.group) {

            if (!filter.groups) {
              filter.groups = {};
            }

            if (!filter.groups[value.group]) {
              filter.groups[value.group] = [];
            }

            filter.groups[value.group].push(value);
          }
        }
        ;
      }

      if (filter.model === undefined) {
        filter.model = filter.default;
      }

      if (filter.model === undefined) {

        if (filter.type == 'checkbox') {
          filter.model = filter.unchecked;

        } else if (filter.type == 'select') {

          if (filter.multiple) {
            if (!Array.isArray(filter.default)) {
              filter.model = [];
            }
          } else {
            if (filter.default === undefined) {
              filter.model = '__all';
            }
          }
        } else if (filter.type == 'autocompletechips') {
          filter.model = [];
        }
      }

      if (filter.change) {
        filter.change = filter.change.apply(filter, this);
        // filter.change = angular.bind(filter,filter.change, options.instance);
      }
    });

    return observable$;
  }

  walkSelectValues(filter, filterValues) {

    let values = [];
    for (let key in filterValues) {

      if (!filterValues[key]) {
        continue;
      }

      let value = {value: key, name: filterValues[key]};

      if (typeof filterValues[key] == 'object') {
        value = filterValues[key];
      }

      if (value.value === null) {
        value.value = 'null';
      }

      values.push(value);
    }
    ;

    return values;
  }

  walkSelectNestedValues(filter, parent_id, values, depth = 0) {
    let prepped_values = [];
    let value_field = filter.nested.value_field || 'id';
    let parent_field = filter.nested.parent_field || 'parent_id';
    let name_field = filter.nested.label_field || 'name';

    for (let key in values) {

      if (!values[key]) {
        continue;
      }

      if (values[key][parent_field] != parent_id) {
        continue;
      }

      let value = {
        value: values[key][value_field],
        name: values[key][name_field],
        depth: depth,
        style: {'margin-left': (depth * 16) + 'px'}
      };

      prepped_values.push(value);

      let children = this.walkSelectNestedValues(filter, values[key][value_field], values, depth + 1);
      if (children.length > 0) {
        Array.prototype.push.apply(prepped_values, children);
      }
    }
    ;

    return prepped_values;
  }

  selectChange(filter) {
    if (filter.isolate) {

      filter.isolate.enabled = false;

      if (filter.multiple && isArray(filter.model)) {
        const index = filter.model.indexOf(filter.isolate.value);

        if (index > -1) {
          filter.model.splice(index, 1);
        }
      }
    }

    this.onFilterChange(filter);
  }

  isolateChange(filter) {

    if (filter.isolate.enabled) {
      filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
    } else {
      filter.model = null;
    }

    this.onFilterChange(filter);
  }

  cancel() {
    this.clear();
    this.filterChange = true;
    this.filterToggle(false, true);
  }

  displayAutocomplete(data): string {
    return data ? data.name : data;
  }

  gets(opts = {}) {

    let query = {};

    for (let filter of this.filter.fsConfig.items) {
      //@TODO
      let value = this.copy(filter.model);

      if (filter.type == 'select') {

        if (filter.multiple) {

          if (filter.isolate) {
            if (!isArray(filter.model) || !filter.model.length) {
              value = arrayList(filter.values, 'value');
            }
          }

        } else {

          if (filter.isolate) {
            if (filter.model == '__all') {
              value = arrayList(filter.values, 'value');
            }
          } else {
            if (filter.model == '__all') {
              value = null;
            }
          }
        }
      } else if (filter.type == 'autocompletechips') {
        if (isArray(filter.model) && filter.model.length && !opts['expand']) {
          value = arrayList(filter.model, 'value');
        }
      }

      // @TODO
      if (isEmpty(value, {zero: true})) {
        continue;
      }

      if (filter.type == 'date' || filter.type == 'datetime') {

        if (value) {
          value = moment(value).format();
        }

      } else if (filter.type == 'daterange' || filter.type == 'datetimerange') {

        let from = value['from'];
        let to = value['to'];

        value = {};
        if (from) {
          value.from = moment(from).format();
        }

        if (to) {
          value.to = moment(to).format();
        }

      } else if (filter.type == 'autocomplete') {

        if (isEmpty(filter.model.value, {zero: true})) {
          continue;
        }

        value = opts['expand'] ? filter.model : filter.model.value;
      }

      if (isObject(filter.names) && opts['names'] !== false) {
        for (let key in filter.names) {
          if (value[filter.names[key]]) {
            query[key] = value[filter.names[key]];
          }
        }
        ;
      } else {
        query[filter.name] = value;
      }
    }
    ;

    if (opts['flatten']) {
      for (let name in query) {
        if (isArray(query[name])) {
          query[name] = query[name].join(',');
        }
      }
      ;
    }

    return query;
  }

  /**
   * @TODO Temp solution
   */
  copy(data) {
    if (isObject(data)) {
      return Object.assign({}, data);
    } else if (isArray(data)) {
      return data.slice();
    } else {
      return data;
    }
  }

  ngOnDestroy() {
  }

}
