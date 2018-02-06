"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@firestitch/common");
var store_1 = require("@firestitch/store");
var classes_1 = require("./../../classes");
var Observable_1 = require("rxjs/Observable");
var router_1 = require("@angular/router");
require("rxjs/add/observable/forkJoin");
var moment_timezone_1 = require("moment-timezone");
var common_2 = require("@angular/common");
var FsFilterComponent = (function () {
    function FsFilterComponent(FsUtil, FsArray, FsStore, route, location) {
        this.FsUtil = FsUtil;
        this.FsArray = FsArray;
        this.FsStore = FsStore;
        this.route = route;
        this.location = location;
        this.filter = null;
        this.searchinput = { value: '' };
        this.extended_filter = false;
        this.filterChange = false;
        this.primary = false;
        this.persists = null;
    }
    FsFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.persists = this.FsStore.get(this.filter.fsConfig.namespace + '-persist', {});
        if (this.persists === undefined) {
            this.persists = {};
        }
        if (this.filter.fsConfig.persist) {
            if (typeof this.filter.fsConfig.persist.persist !== 'object') {
                this.filter.fsConfig.persist = { name: this.filter.fsConfig.persist };
            }
            if (!this.filter.fsConfig.persist.name) {
                this.filter.fsConfig.persist.name = this.location.path();
            }
            if (!this.persists[this.filter.fsConfig.persist.name] || !this.persists[this.filter.fsConfig.persist.name]['data']) {
                this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
            }
            if (this.filter.fsConfig.persist.timeout) {
                var date = new Date(this.persists[this.filter.fsConfig.persist.name]['date']);
                if (moment_timezone_1.default(date).subtract(this.filter.fsConfig.persist.timeout, 'minutes').isAfter(moment_timezone_1.default())) {
                    this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
                }
            }
        }
        // preload any filters which have filter.wait.  Once they are all loaded then proceed to load main data & rest of filters.
        var wait_observables$ = [], update_observables$ = [];
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            if (filter.name && this.FsUtil.isObject(filter.name)) {
                filter.names = filter.name;
                filter.name = Object.keys(filter.names).join('-');
            }
            if (this.filter.fsConfig.persist) {
                var persisted = this.persists[this.filter.fsConfig.persist.name]['data'];
                if (persisted[filter.name]) {
                    var value = persisted[filter.name];
                    if (value) {
                        if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                            value.from = value.from ? moment_timezone_1.default.utc(value.from) : null;
                            value.to = value.to ? moment_timezone_1.default.utc(value.to) : null;
                        }
                        else if (filter.type.match(/^date/)) {
                            value = moment_timezone_1.default(value);
                        }
                    }
                    filter.model = value;
                }
            }
            if (filter.query) {
                var query = this.route.snapshot.queryParams[filter.query];
                if (query !== undefined) {
                    query += '';
                    filter.model = query;
                    if (!query.length) {
                        filter.model = undefined;
                    }
                    else if (filter.type == 'select' && filter.multiple) {
                        filter.model = filter.model.split(',');
                    }
                    else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                        var parts = filter.model.split(',');
                        filter.model = { from: moment_timezone_1.default(parts[0]), to: moment_timezone_1.default(parts[1]) };
                    }
                    else if (filter.type == 'range') {
                        var parts = filter.model.split(',');
                        filter.model = { min: parts[0], max: parts[1] };
                    }
                }
            }
            if (typeof filter.values == 'function' && !filter.type.match(/^autocomplete/)) {
                filter.values = filter.values();
            }
            var observable$ = this.sanitizeFilter(filter);
            if (filter.wait || (filter.type == 'select' && filter.isolate && filter.wait === undefined)) {
                wait_observables$.push(observable$);
            }
            else {
                update_observables$.push(observable$);
            }
        }
        ;
        Observable_1.Observable.forkJoin(wait_observables$)
            .subscribe(function () { }, function () { }, function () {
            if (_this.filter.fsConfig.load) {
                _this.reload({ filterUpdate: false });
            }
            Observable_1.Observable.forkJoin(update_observables$)
                .subscribe(function () { }, function () { }, function () {
                if (_this.filter.fsConfig.init) {
                    _this.filter.fsConfig.init(_this);
                }
                _this.filterUpdate();
            });
        });
    };
    FsFilterComponent.prototype.menuFilterChange = function (search) {
        var text = '';
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
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
        var matches = search.match(/(\([^\)]+\):\([^\)]+\)|\([^\)]+\):[^\s]+|[^:]+:\([^\)]+\)|[^\s]+)/g) || [];
        var values = {};
        var textSearch = [];
        for (var _b = 0, matches_1 = matches; _b < matches_1.length; _b++) {
            var match = matches_1[_b];
            var filter_match = match.trim().match(/\(?([^:\)]+)\)?:\(?([^)]+)/);
            if (filter_match) {
                values[filter_match[1].trim()] = filter_match[2];
            }
            else {
                textSearch.push(match);
            }
        }
        ;
        this.filtersClear();
        for (var _c = 0, _d = this.filter.fsConfig.items; _c < _d.length; _c++) {
            var filter = _d[_c];
            if (filter.type == 'text' && filter.primary) {
                filter.model = textSearch.join(' ');
            }
        }
        ;
        for (var label in values) {
            if (!values[label]) {
                continue;
            }
            var filter = this.FsArray.filter(this.filter.fsConfig.items, { label: label })[0];
            if (filter) {
                if (filter.type == 'date' || filter.type == 'datetime') {
                    var date = Date.parse(values[label]);
                    if (date) {
                        filter.model = moment_timezone_1.default(date);
                    }
                }
                else if (filter.type == 'daterange') {
                    var parts = values[label].split(/\s+to\s+/);
                    var from = Date.parse(parts[0]);
                    var to = Date.parse(parts[1]);
                    filter.model = {};
                    if (from) {
                        filter.model.from = from;
                    }
                    if (to) {
                        filter.model.to = to;
                    }
                }
                else if (filter.type == 'range') {
                    var parts = values[label].split(',');
                    filter.model = { min: parts[0], max: parts[1] };
                }
                else if (filter.type == 'select') {
                    if (filter.multiple) {
                        var values_1 = [];
                        for (var _e = 0, _f = values_1[label].split(','); _e < _f.length; _e++) {
                            var value = _f[_e];
                            var item = this.FsArray.filter(filter.values, { name: value })[0];
                            if (item) {
                                values_1.push(item.value);
                            }
                        }
                        ;
                        filter.model = values_1;
                    }
                    else {
                        var item = this.FsArray.filter(filter.values, { name: values[label] })[0];
                        if (item) {
                            filter.model = item.value;
                        }
                    }
                }
                else if (filter.type == 'checkbox') {
                    filter.model = (values[label] == 'Yes') ? filter.checked : filter.unchecked;
                }
                else {
                    filter.model = values[label];
                }
            }
        }
        ;
        this.reload({ filterUpdate: false });
    };
    FsFilterComponent.prototype.filtersClear = function () {
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            filter.model = undefined;
            if (filter.type == 'autocomplete') {
                filter.model = null;
                filter.search = '';
            }
            else if (filter.type == 'autocompletechips') {
                filter.model = [];
                filter.search = '';
            }
            else if (filter.type == 'select' && filter.isolate) {
                filter.model = null;
                filter.isolate.enabled = false;
            }
            else if (filter.type == 'checkbox') {
                filter.model = filter.unchecked;
            }
            else if (filter.type == 'range') {
                filter.model = {};
            }
        }
        ;
    };
    FsFilterComponent.prototype.menuFilterClick = function ($event) {
        if (window.innerWidth >= 600) {
            this.filterUpdate();
            if (window.getSelection && window.getSelection().toString()) {
                var selected_1 = window.getSelection().toString();
                if (selected_1) {
                    setTimeout(function () {
                        var index = $event.target.value.indexOf(selected_1);
                        if (index >= 0) {
                            $event.target.setSelectionRange(index, index + selected_1.length);
                        }
                    });
                }
            }
            this.menuFilterShow();
        }
    };
    FsFilterComponent.prototype.menuFilterKeydown = function ($event) {
        this.filterToggle($event.keyCode !== 13);
    };
    FsFilterComponent.prototype.menuFilterShow = function () {
        this.filterToggle(true);
    };
    FsFilterComponent.prototype.clear = function () {
        this.filtersClear();
        this.filterUpdate();
    };
    FsFilterComponent.prototype.reload = function (opts) {
        return this.load(Object.assign({}, { clear: true }, opts));
    };
    FsFilterComponent.prototype.load = function (opts) {
        if (opts === void 0) { opts = {}; }
        if (opts['filterUpdate'] !== false) {
            this.filterUpdate();
        }
        var query = this.gets({ flatten: true });
        if (this.filter.fsConfig.persist) {
            this.persists[this.filter.fsConfig.persist.name] = { data: this.gets({ expand: true, names: false }), date: new Date() };
            this.FsStore.set(this.filter.fsConfig.namespace + '-persist', this.persists, {});
        }
        if (this.filter.fsConfig.change) {
            this.filter.fsConfig.change(query, this);
        }
    };
    FsFilterComponent.prototype.filterToggle = function (value, search) {
        this.extended_filter = value;
        setTimeout(function () {
            var body = document.body;
            value ? body.classList.add('fs-filters-open') : body.classList.remove('fs-filters-open');
        });
        if (search && !value && this.filterChange) {
            this.reload();
        }
        if (value) {
            this.filterChange = false;
        }
        this.filterUpdate();
    };
    FsFilterComponent.prototype.onFilterChange = function (filter, $event) {
        this.filterChange = true;
        if (this.filter.fsConfig.inline) {
            this.load();
        }
    };
    FsFilterComponent.prototype.onAutocompleteChange = function (filter, $event) {
        if (this.FsUtil.isObject(filter.model)) {
            this.onFilterChange(filter);
        }
        else {
            filter.values$ = filter.values(filter.model);
        }
    };
    FsFilterComponent.prototype.onAutocompleteChipsChange = function (filter, input) {
        var _this = this;
        if (!this.FsUtil.isObject(filter.selectedValue)) {
            filter.values$ = filter.values(filter.selectedValue)
                .map(function (values) {
                var selected = _this.FsArray.list(filter.model, 'value');
                return _this.FsArray.filter(values, function (value) {
                    return selected.indexOf(value.value) === -1;
                });
            });
        }
        else {
            input.value = '';
        }
    };
    FsFilterComponent.prototype.removeAutucompleteChipItem = function (filter, item) {
        this.FsArray.remove(filter.model, { value: item.value });
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.addAutucompleteChipItem = function (filter, $event) {
        filter.model.push($event.option.value);
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.filterKeyup = function (filter, $event) {
        if (filter.type == 'text' || filter.type == 'select') {
            if ($event.keyCode == 13) {
                setTimeout(function () {
                    this.onFilterChange(filter);
                    this.filterToggle(false, true);
                });
            }
        }
    };
    FsFilterComponent.prototype.filterUpdate = function () {
        var label, formatted, searches = [];
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            var value = this.copy(filter.model);
            if (filter.type === 'select') {
                if (filter.multiple) {
                    if (!this.FsUtil.isArray(value) || !value.length) {
                        continue;
                    }
                    var values = [];
                    for (var _b = 0, value_1 = value; _b < value_1.length; _b++) {
                        var item = value_1[_b];
                        for (var _c = 0, _d = filter.values; _c < _d.length; _c++) {
                            var filter_item = _d[_c];
                            if (!String(filter_item.value).localeCompare(String(item))) {
                                values.push(filter_item.name);
                            }
                        }
                    }
                    value = values.join(',');
                }
                else {
                    if (value == '__all' || value === null || value === undefined) {
                        continue;
                    }
                    for (var _e = 0, _f = filter.values; _e < _f.length; _e++) {
                        var filter_item = _f[_e];
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
            if (this.FsUtil.isEmpty(value, { zero: true })) {
                continue;
            }
            if (filter.type == 'autocomplete') {
                value = filter.model.name;
            }
            else if (filter.type == 'autocompletechips') {
                if (!this.FsUtil.isArray(filter.model) || !filter.model.length) {
                    continue;
                }
                var values = [];
                for (var _g = 0, _h = filter.model; _g < _h.length; _g++) {
                    var item = _h[_g];
                    values.push(item.name);
                }
                value = values.join(',');
            }
            else if (filter.type == 'date' || filter.type == 'datetime') {
                var format = 'MMM D, YYYY';
                if (filter.type == 'datetime') {
                    format += ' h:mm a';
                }
                value = moment_timezone_1.default(value);
                if (!value) {
                    continue;
                }
                value = value.format(format);
            }
            else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                if (value) {
                    var from = moment_timezone_1.default(value.from);
                    var to = moment_timezone_1.default(value.to);
                    var format = filter.type == 'datetimerange' ? 'MMM D, YYYY h:mm a' : 'MMM D, YYYY';
                    value = [];
                    if (from) {
                        value.push(from.format(format));
                    }
                    if (to) {
                        value.push(to.format(format));
                    }
                    value = value.join(' to ');
                }
            }
            else if (filter.type == 'checkbox') {
                if (filter.model == filter.unchecked) {
                    return;
                }
                else {
                    value = 'Yes';
                }
            }
            else if (filter.type == 'range') {
                var min = value['min'];
                var max = value['max'];
                var parts = [];
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
            }
            else {
                label = filter.label.match(/\s/) ? '(' + filter.label + ')' : filter.label;
            }
            formatted = label + ':' + (value.match(/\s/) ? '(' + value + ')' : value);
            searches.push({ value: value,
                type: filter.type,
                formatted: formatted });
        }
        ;
        this.searchinput.value = '';
        if (searches.length === 1 && searches[0].type == 'text') {
            this.searchinput.value = searches[0].value;
        }
        else {
            for (var _j = 0, searches_1 = searches; _j < searches_1.length; _j++) {
                var search = searches_1[_j];
                this.searchinput.value += search.formatted + ' ';
            }
            this.searchinput.value = this.searchinput.value.trim();
        }
    };
    FsFilterComponent.prototype.sanitizeFilter = function (filter) {
        var _this = this;
        var observable$ = new Observable_1.Observable(function (observer) {
            if (filter.values && typeof filter.values == 'object' && filter.values instanceof Observable_1.Observable) {
                filter.values.subscribe(function (values) {
                    observer.next(values);
                    observer.complete();
                });
            }
            else {
                observer.next(filter.values);
                observer.complete();
            }
        });
        var $subscriber = observable$.subscribe(function (values) {
            if (filter.primary) {
                _this.primary = true;
            }
            else {
                filter.primary = false;
            }
            if (filter.type == 'checkbox') {
                filter.checked = _this.FsUtil.string(filter.checked);
                filter.unchecked = _this.FsUtil.string(filter.unchecked);
                filter.default = filter.default === undefined ? filter.unchecked : _this.FsUtil.string(filter.default);
            }
            else if (filter.type == 'text') {
                if (!_this.primary) {
                    filter.primary = _this.primary = true;
                }
            }
            else if (filter.type == 'range') {
                if (!filter.placeholder) {
                    filter.placeholder = ['Min', 'Max'];
                }
                if (!filter.model) {
                    filter.model = {};
                }
            }
            else if (filter.type == 'select') {
                filter.values = values;
                filter.groups = null;
                var data = [];
                if (filter.nested) {
                    // generate a list of values from objects that have not been nested.
                    if (!filter.multiple) {
                        data.push({ value: '__all', name: 'All', depth: 0 });
                    }
                    Array.prototype.push.apply(data, _this.walkSelectNestedValues(filter, null, filter.values));
                }
                else {
                    data = _this.walkSelectValues(filter, filter.values);
                }
                filter.values = data;
                if (filter.isolate) {
                    for (var index in filter.values) {
                        if (!filter.values[index]) {
                            continue;
                        }
                        if (filter.values[index].value == filter.isolate.value) {
                            filter.values.splice(index, 1);
                        }
                    }
                    ;
                    if (_this.FsUtil.isArray(filter.model)) {
                        if (filter.model.length == filter.values.length) {
                            filter.model = null;
                            filter.isolate.enabled = false;
                        }
                        else if (filter.model[0] == filter.isolate.value) {
                            filter.isolate.enabled = true;
                        }
                    }
                }
                for (var _i = 0, _a = filter.values; _i < _a.length; _i++) {
                    var value = _a[_i];
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
                }
                else if (filter.type == 'select') {
                    if (filter.multiple) {
                        if (!Array.isArray(filter.default)) {
                            filter.model = [];
                        }
                    }
                    else {
                        if (filter.default === undefined) {
                            filter.model = '__all';
                        }
                    }
                }
                else if (filter.type == 'autocompletechips') {
                    filter.model = [];
                }
            }
            if (filter.change) {
                filter.change = filter.change.apply(filter, _this);
                // filter.change = angular.bind(filter,filter.change, options.instance);
            }
        });
        return observable$;
    };
    FsFilterComponent.prototype.walkSelectValues = function (filter, filterValues) {
        var values = [];
        for (var key in filterValues) {
            if (!filterValues[key]) {
                continue;
            }
            var value = { value: key, name: filterValues[key] };
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
    };
    FsFilterComponent.prototype.walkSelectNestedValues = function (filter, parent_id, values, depth) {
        if (depth === void 0) { depth = 0; }
        var prepped_values = [];
        var value_field = filter.nested.value_field || 'id';
        var parent_field = filter.nested.parent_field || 'parent_id';
        var name_field = filter.nested.label_field || 'name';
        for (var key in values) {
            if (!values[key]) {
                continue;
            }
            if (values[key][parent_field] != parent_id) {
                continue;
            }
            var value = {
                value: values[key][value_field],
                name: values[key][name_field],
                depth: depth,
                style: { 'margin-left': (depth * 16) + 'px' }
            };
            prepped_values.push(value);
            var children = this.walkSelectNestedValues(filter, values[key][value_field], values, depth + 1);
            if (children.length > 0) {
                Array.prototype.push.apply(prepped_values, children);
            }
        }
        ;
        return prepped_values;
    };
    FsFilterComponent.prototype.selectChange = function (filter) {
        if (filter.isolate) {
            filter.isolate.enabled = false;
            if (filter.multiple && this.FsUtil.isArray(filter.model)) {
                var index = filter.model.indexOf(filter.isolate.value);
                if (index > -1) {
                    filter.model.splice(index, 1);
                }
            }
        }
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.isolateChange = function (filter) {
        if (filter.isolate.enabled) {
            filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
        }
        else {
            filter.model = null;
        }
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.reset = function () {
        this.clear();
        this.filterChange = true;
    };
    FsFilterComponent.prototype.displayAutocomplete = function (data) {
        return data ? data.name : data;
    };
    FsFilterComponent.prototype.gets = function (opts) {
        if (opts === void 0) { opts = {}; }
        var query = {};
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            //@TODO
            var value = this.copy(filter.model);
            if (filter.type == 'select') {
                if (filter.multiple) {
                    if (filter.isolate) {
                        if (!this.FsUtil.isArray(filter.model) || !filter.model.length) {
                            value = this.FsArray.list(filter.values, 'value');
                        }
                    }
                }
                else {
                    if (filter.isolate) {
                        if (filter.model == '__all') {
                            value = this.FsArray.list(filter.values, 'value');
                        }
                    }
                    else {
                        if (filter.model == '__all') {
                            value = null;
                        }
                    }
                }
            }
            else if (filter.type == 'autocompletechips') {
                if (this.FsUtil.isArray(filter.model) && filter.model.length && !opts['expand']) {
                    value = this.FsArray.list(filter.model, 'value');
                }
            }
            // @TODO
            if (this.FsUtil.isEmpty(value, { zero: true })) {
                continue;
            }
            if (filter.type == 'date' || filter.type == 'datetime') {
                if (value) {
                    value = moment_timezone_1.default(value).format();
                }
            }
            else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                var from = value['from'];
                var to = value['to'];
                value = {};
                if (from) {
                    value.from = moment_timezone_1.default(from).format();
                }
                if (to) {
                    value.to = moment_timezone_1.default(to).format();
                }
            }
            else if (filter.type == 'autocomplete') {
                if (this.FsUtil.isEmpty(filter.model.value, { zero: true })) {
                    continue;
                }
                value = opts['expand'] ? filter.model : filter.model.value;
            }
            if (this.FsUtil.isObject(filter.names) && opts['names'] !== false) {
                for (var key in filter.names) {
                    if (value[filter.names[key]]) {
                        query[key] = value[filter.names[key]];
                    }
                }
                ;
            }
            else {
                query[filter.name] = value;
            }
        }
        ;
        if (opts['flatten']) {
            for (var name_1 in query) {
                if (this.FsUtil.isArray(query[name_1])) {
                    query[name_1] = query[name_1].join(',');
                }
            }
            ;
        }
        return query;
    };
    /**
     * @TODO Temp solution
     */
    FsFilterComponent.prototype.copy = function (data) {
        if (this.FsUtil.isObject(data)) {
            return Object.assign({}, data);
        }
        else if (this.FsUtil.isArray(data)) {
            return data.slice();
        }
        else {
            return data;
        }
    };
    FsFilterComponent.prototype.ngOnDestroy = function () { };
    __decorate([
        core_1.Input(),
        __metadata("design:type", classes_1.FsFilter)
    ], FsFilterComponent.prototype, "filter", void 0);
    FsFilterComponent = __decorate([
        core_1.Component({
            selector: 'fs-filter',
            templateUrl: './fsfilter.component.html',
            styleUrls: ['./fsfilter.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [common_1.FsUtil, common_1.FsArray,
            store_1.FsStore, router_1.ActivatedRoute, common_2.Location])
    ], FsFilterComponent);
    return FsFilterComponent;
}());
exports.FsFilterComponent = FsFilterComponent;
//# sourceMappingURL=fsfilter.component.js.map