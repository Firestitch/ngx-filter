import { OnInit, OnDestroy } from '@angular/core';
import { FsStore } from '@firestitch/store';
import { FsFilter } from './../../classes';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import { Location } from '@angular/common';
export declare class FsFilterComponent implements OnInit, OnDestroy {
    private _store;
    private route;
    private location;
    filter: FsFilter;
    searchinput: {
        value: string;
    };
    extendedFilter: boolean;
    filterChange: boolean;
    primary: boolean;
    persists: any;
    constructor(_store: FsStore, route: ActivatedRoute, location: Location);
    ngOnInit(): void;
    menuFilterChange(search: any): void;
    filtersClear(): void;
    menuFilterClick($event: any): void;
    menuFilterKeydown($event: any): void;
    menuFilterShow(): void;
    clear(): void;
    reload(opts?: any): void;
    load(opts?: any): void;
    filterToggle(value: any, search?: any): void;
    onFilterChange(filter: any, $event?: any): void;
    onAutocompleteChange(filter: any, $event?: any): void;
    onAutocompleteChipsChange(filter: any, input: any): void;
    removeAutucompleteChipItem(filter: any, item: any): void;
    addAutucompleteChipItem(filter: any, $event: any): void;
    filterKeyup(filter: any, $event: any): void;
    filterUpdate(): void;
    sanitizeFilter(filter: any): Observable<{}>;
    walkSelectValues(filter: any, filterValues: any): any[];
    walkSelectNestedValues(filter: any, parentId: any, values: any, depth?: number): any[];
    selectChange(filter: any): void;
    isolateChange(filter: any): void;
    cancel(): void;
    displayAutocomplete(data: any): string;
    gets(opts?: any): {};
    /**
     * @TODO Temp solution
     */
    copy(data: any): any;
    ngOnDestroy(): void;
}
