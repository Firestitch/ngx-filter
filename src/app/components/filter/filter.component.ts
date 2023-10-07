import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatInput } from '@angular/material/input';

import { BehaviorSubject, combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import { ActionsController } from '../../classes/actions-controller';
import { objectsAreEquals } from '../../helpers/compare';
import { FsFilterAction } from '../../interfaces/action.interface';
import { FilterConfig, FilterSort, IFilterConfigItem } from '../../interfaces/config.interface';
import { ISortingChangeEvent } from '../../interfaces/filter.interface';
import { IUpdateFilterItemConfig } from '../../interfaces/update-filter-item.interface';
import { FsFilterConfig } from '../../models/filter-config';
import { BaseItem } from '../../models/items/base-item';
import { ExternalParamsController } from '../../services/external-params-controller.service';
import { PersistanceParamsController } from '../../services/external-params/persistance-params-controller.service';
import { QueryParamsController } from '../../services/external-params/query-params-controller.service';
import { SavedFiltersController } from '../../services/external-params/saved-filters-controller.service';
import { FsFilterOverlayService } from '../../services/filter-overlay.service';
import { FocusControllerService } from '../../services/focus-controller.service';
import { FsFilterItemsStore } from '../../services/items-store.service';
import { FilterStatusBarDirective } from './../../directives/status-bar/status-bar.directive';
import { FS_FILTER_CONFIG } from './../../injectors/filter-config';


@Component({
  selector: 'fs-filter',
  styleUrls: ['./filter.component.scss'],
  templateUrl: './filter.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    FsFilterOverlayService,
    ExternalParamsController,
    PersistanceParamsController,
    QueryParamsController,
    FocusControllerService,
    FsFilterItemsStore,
    SavedFiltersController,
    ActionsController,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input('config')
  set setConfig(config) {
    this._initFilterWithConfig(config);
  }

  @Input('filter')
  set setFilter(config) {
    this._initFilterWithConfig(config);
  }

  @Input() public showSortBy: any = true;
  @Input() public showFilterInput = true;
  @Output() public closed = new EventEmitter<any>();
  @Output() public opened = new EventEmitter<any>();
  @Output() public ready = new EventEmitter<void>();

  @ContentChild(FilterStatusBarDirective, { read: TemplateRef })
  public statusBar;

  @ViewChild('keywordMatInput', { read: MatInput })
  public keywordMatInput: MatInput;

  @HostBinding('class.filters-open')
  public showFilterMenu = false;

  @HostBinding('class.window-desktop')
  public windowDesktop = false;

  @HostBinding('class.fs-filter')
  public fsFilterClass = true;

  @HostBinding('class.has-keyword')
  public get hasKeyword() {
    return this._filterItems.hasKeyword;
  }

  public searchPlaceholder = 'Search';
  public keyword = '';

  protected _config: FsFilterConfig = null;

  private _sort: FilterSort;
  private _filtersBtnVisible$ = new BehaviorSubject(true);
  private _keywordVisible$ = new BehaviorSubject(true);
  private _hasFilterChips$ = new BehaviorSubject(false);
  private _keyword$ = new Subject();
  private _destroy$ = new Subject<void>();

  constructor(
    @Optional() @Inject(FS_FILTER_CONFIG) private _defaultConfig: FsFilterConfig,
    private _filterOverlay: FsFilterOverlayService,
    private _zone: NgZone,
    private _externalParams: ExternalParamsController,
    private _filterItems: FsFilterItemsStore,
    private _actions: ActionsController,
  ) {
    this._listenWhenFilterReady();
    this._updateWindowWidth();

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
        this.showFilterMenu = false;
      });

    this._listenWindowResize();
  }

  public get config(): FsFilterConfig {
    return this._config;
  }

  public get filterParams() {
    return this._filterItems.values();
  }

  public get filterParamsQuery(): Record<string, unknown> {
    return this._filterItems.valuesAsQuery();
  }

  public get items() {
    return this._filterItems.items;
  }

  public get visibleItems() {
    return this._filterItems.visibleItems;
  }

  public get itemsReady$(): Observable<boolean> {
    return this._filterItems.ready$;
  }

  public get hasFilterChips$(): Observable<boolean> {
    return this._hasFilterChips$.asObservable();
  }

  public get hasVisibleItemOrSorting(): boolean {
    return this.visibleItems.length > 0 || !!this._filterItems.sortByItem
  }

  public get filtersBtnVisible$(): Observable<boolean> {
    return this._filtersBtnVisible$.asObservable();
  }

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordVisible$.asObservable();
  }

  public get actionsVisible$() {
    return this._actions.visible$;
  }

  public get actions$() {
    return this._actions.actions$;
  }

  public get menuActions$() {
    return this._actions.menuActions$;
  }

  public ngOnInit() {
    // Avoid ngChanges error
    setTimeout(() => {
      if (this.config.autofocus) {
        this.focus();
      }
    });

    this._listenInputChanges()
    this._listenInternalItemsChange();
    this._initOverlay();
  }

  public ngOnDestroy() {
    this._destroyFilterDrawer();

    this._destroy$.next();
    this._destroy$.complete();
  }

  public focus() {
    this.keywordMatInput?.focus();
  }

  public updateSort(sort: ISortingChangeEvent) {
    this._filterItems.updateSort(sort)
  }

  /**
   *
   * Do update value of some field
   *
   * @param values - values for update
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
  public updateValues(values) {
    Object.keys(values).forEach((key) => {
      const filterItem = this.items
        .find((item) => item.name === key);

      if (!filterItem) {
        return;
      }

      filterItem.model = values[key];
    });
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

  public get itemValues(): any[] {
    return this.items
      .map((item) => item.value);
  }

  public get nonEmptyItemValues(): any[] {
    return this.items
      .filter((item) => item.value !== undefined)
      .map((item) => item.value);
  }

  public get hasItemValues(): boolean {
    return this.items
      .some((item) => item.value !== undefined);
  }

  public getItemValue(name: string) {
    const item = this.items
      .find((item) => item.name === name);

    return item?.value;
  }

  public showItem(name: string) {
    const item = this.getItem(name);

    if (item) {
      item.hide = false;

      this._filterItems.updateItemsVisiblity();
    }
  }

  public hideItem(name: string) {
    const item = this.getItem(name);

    if (!item) { return }

    item.hide = true;

    this._filterItems.updateItemsVisiblity();
  }

  public clearItem(name: string) {
    const item = this.getItem(name);

    if (!item) { return }

    item.clear();
  }

  public updateItemConfig(
    name: string,
    params: IUpdateFilterItemConfig
  ): void {
    const item = this.getItem(name);

    if (!item) { return }

    item.label = params.label ?? item.label;
    item.chipLabel = params.chipLabel ?? item.chipLabel;

    this._filterItems.updateItemsVisiblity();
  }

  public getItemValueChange$(name: string): Observable<any> | null {
    const item = this.items.find((i) => i.name === name);

    if (item) {
      return item.value$
        .pipe(
          map(() => {
            return item.model;
          }),
        );
    } else {
      return null;
    }
  }

  public changeVisibility(state: boolean) {
    if (state === this.showFilterMenu) {
      return;
    }

    if (!state) {
      this.closed.emit();
      return this._destroyFilterDrawer();
    }

    if (!this.hasVisibleItemOrSorting) {
      return;
    }

    this._listenEscButton();

    this.opened.emit();

    this._filterOverlay.open();
  }

  public init() {
    const data = this._filterItems.valuesAsQuery();
    this._sort = this._filterItems.getSort();

    if (this.config.init) {
      this.config.init(data, this._sort);
    }

    this._updateChipsVisibility();

    // Waiting for external ViewChilds
    setTimeout(() => {
      this.items
        .forEach((item) => {
          item.init(item);
        });
    });
  }

  public clear(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this._filterItems.filtersClear();

    if (this.config.clear) {
      this.config.clear();
    }

    this.keyword = '';
  }

  /**
   * Close filter window and do change callback
   */
  public search(event) {
    this.changeVisibilityClick(false, event);
  }

  public reload(event = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const data = this._filterItems.valuesAsQuery();

    if (this.config.reload) {
      this.config.reload(data, this._filterItems.getSort());
    }
  }

  public getItem(name): BaseItem<any> {
    return this.items
      .find((item) => item.name === name);
  }

  public fetchQueryParams(): void {
    this._externalParams.fetchQueryParams();
  }

  /**
   * Call change callback and apply new filter values
   */
  public change() {
    const data = this._filterItems.valuesAsQuery();
    const sort = this._filterItems.getSort();

    const sortingChanged = ((!sort || !this._sort) && sort !== this._sort)
      || (sort && this._sort && !objectsAreEquals(this._sort, sort));

    if (sortingChanged) {
      this._sort = sort;

      if (this.config.sortChange) {
        this.config.sortChange(data, sort);
      }
    }

    if (this.config.change) {
      this.config.change(data, sort);
    }

    this._updateChipsVisibility();

    // visibility for actions can depend on filters state
    this._actions.updateActionsVisibility();
  }

  /**
   * Update filter actions config
   * @param actions
   */
  public updateActions(actions: FsFilterAction[]): void {
    this._actions.initActions(actions);
  }

  /**
   * Show "Filters" button
   */
  public showFiltersBtn(): void {
    this._filtersBtnVisible$.next(true);
  }

  /**
   * Hide "Filters" button
   */
  public hideFiltersBtn(): void {
    this._filtersBtnVisible$.next(false);
  }

  /**
   * Show "Keyword" field if it present
   */
  public showKeywordField(): void {
    this._keywordVisible$.next(true);
  }

  /**
   * Hide "Keyword" field if it present
   */
  public hideKeywordField(): void {
    this._keywordVisible$.next(false);
  }

  /**
   * Go through actions and check show() callback and update visible actions
   */
  public updateActionsVisibility(): void {
    this._actions.updateActionsVisibility();
  }

  /**
   * Go through actions and check disabled() callback and update disabled state
   */
  public updateDisabledState(): void {
    this._actions.updateDisabledState();
  }

  public setItems(items: IFilterConfigItem[]) {
    this._filterItems.destroyItems();

    this.config.items = items;
    this._filterItems.setConfig(this._config);
    this._externalParams.initItems();

    this._syncSearchInputWithKeyword();
  }

  private _initFilterWithConfig(config: FilterConfig) {
    if (this.config) {
      this._filterItems.destroyItems();
    }

    config = {
      ...(this._defaultConfig || {}),
      ...config,
    };

    this._config = new FsFilterConfig(config);
    this._actions.setConfig(this._config);
    this._filterItems.setConfig(this._config);
    this._externalParams.setConfig(this._config);

    this._syncSearchInputWithKeyword();

    if (!!this.config.reloadWhenConfigChanged) {
      this.change();
    }
  }

  private _destroyFilterDrawer() {
    this._filterOverlay.close();
  }

  private _updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  private _listenEscButton() {
    this._zone.runOutsideAngular(() => {
      fromEvent(window, 'keyup')
        .pipe(
          filter((event: KeyboardEvent) => event.code === 'Escape'),
          takeUntil(this.closed),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._zone.run(() => {
            this.changeVisibility(false);
          });
        });
    });
  }

  private _listenWindowResize() {
    this._zone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(100),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._zone.run(() => {
            this._updateWindowWidth();
          });
        });
    })
  }

  public keywordChange(keyword) {
    this._keyword$.next(keyword);
  }

  private _listenInputChanges() {
    this._keyword$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        const keywordItem = this._filterItems.keywordItem;
        keywordItem.model = value;
        this.change();
      });
  }

  private _syncSearchInputWithKeyword(): void {
    const keywordItem = this._filterItems.keywordItem;
    if (keywordItem) {
      this.keyword = keywordItem.model;
      this.searchPlaceholder = keywordItem.label as string || 'Search';
    }
  }

  private _listenInternalItemsChange() {
    this._filterItems
      .itemsChange$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.change();
      });
  }

  private _initOverlay() {
    this._filterOverlay.setClearFn(this.clear.bind(this));
    this._filterOverlay.setDoneFn(this.hide.bind(this));
  }

  // We may need some time to recieve external params and after that ready can be emitted
  private _listenWhenFilterReady() {
    combineLatest(
      [
        this._externalParams.pending$,
        this.itemsReady$,
      ])
      .pipe(
        filter(([pendingParams, itemsReady]) => !pendingParams && itemsReady),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.init();
        this._syncSearchInputWithKeyword();

        this.ready.emit();
      });
  }

  private _updateChipsVisibility() {
    const hasFilterChips = this._filterItems.items
      .some((item: BaseItem<any>) => {
        return item.isChipVisible;
      });

    this._hasFilterChips$.next(hasFilterChips);
  }
}
