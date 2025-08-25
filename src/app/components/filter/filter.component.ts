import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconAnchor } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { FsClearModule } from '@firestitch/clear';
import { DrawerRef } from '@firestitch/drawer';
import { FsFormModule } from '@firestitch/form';

import { BehaviorSubject, combineLatest, fromEvent, interval, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import { ActionsController } from '../../classes/actions-controller';
import { FilterIcon } from '../../consts';
import { objectsAreEquals } from '../../helpers/compare';
import { IFilterSavedFilter, ISortingChangeEvent, KeyValue } from '../../interfaces';
import { FsFilterAction } from '../../interfaces/action.interface';
import {
  FilterConfig, FilterSort, IFilterConfigItem, SortItem,
} from '../../interfaces/config.interface';
import { IUpdateFilterItemConfig } from '../../interfaces/update-filter-item.interface';
import { FsFilterConfig } from '../../models/filter-config';
import { BaseItem } from '../../models/items/base-item';
import { TextItem } from '../../models/items/text-item';
import { FsFilterOverlayService } from '../../services/filter-overlay.service';
import { FocusControllerService } from '../../services/focus-controller.service';
import { ItemStore } from '../../services/item-store.service';
import { ParamController } from '../../services/param-controller.service';
import { PersistanceController } from '../../services/persistance-controller.service';
import { QueryParamController } from '../../services/query-param-controller.service';
import { SavedFilterController } from '../../services/saved-filter-controller.service';
import { FsFilterActionsComponent } from '../actions/actions.component';
import { FsFilterChipsComponent } from '../filter-chips/filter-chips.component';
import { FsSavedFilterAutocompleteChipsComponent } from '../saved-filter/saved-filter-autocomplete-chips/saved-filter-autocomplete-chips.component';

import { FilterStatusBarDirective } from './../../directives/status-bar/status-bar.directive';
import { FS_FILTER_CONFIG } from './../../injectors/filter-config';


@Component({
  selector: 'fs-filter',
  styleUrls: ['./filter.component.scss'],
  templateUrl: './filter.component.html',
  providers: [
    FsFilterOverlayService,
    ParamController,
    PersistanceController,
    QueryParamController,
    FocusControllerService,
    ItemStore,
    SavedFilterController,
    ActionsController,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FsSavedFilterAutocompleteChipsComponent,
    MatFormField,
    NgClass,
    MatPrefix,
    MatIcon,
    MatInput,
    FormsModule,
    FsFormModule,
    FsClearModule,
    FsFilterChipsComponent,
    FsFilterActionsComponent,
    MatIconAnchor,
    MatSlideToggle,
    AsyncPipe,
  ],
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input('config')
  public set setConfig(config) {
    this._initFilterWithConfig(config);
  }

  @Input('filter')
  public set setFilter(config) {
    this._initFilterWithConfig(config);
  }

  @Input() public showSortBy: any = true;
  @Output() public closed = new EventEmitter<any>();
  @Output() public opened = new EventEmitter<any>();
  @Output() public ready = new EventEmitter<void>();

  @ContentChild(FilterStatusBarDirective)
  public statusBar: FilterStatusBarDirective;

  @ViewChild('keywordMatInput', { read: MatInput })
  public keywordMatInput: MatInput;

  @ViewChild('reloadEl', { read: ElementRef })
  public reloadEl: ElementRef;

  @HostBinding('class.filters-open')
  public showFilterMenu = false;

  @HostBinding('class.window-desktop')
  public windowDesktop = false;

  @HostBinding('class.fs-filter')
  public fsFilterClass = true;

  public searchPlaceholder = 'Search';
  public keyword = '';
  public autoReload = true;

  protected _config: FsFilterConfig = null;

  private _sort: FilterSort;
  private _filtersBtnVisible$ = new BehaviorSubject(true);
  private _keywordVisible$ = new BehaviorSubject(true);
  private _hasFilterChips$ = new BehaviorSubject(false);
  private _keyword$ = new Subject();
  private _destroy$ = new Subject<void>();
  private _dialogRef = inject(MatDialogRef, { optional: true });
  private _drawerRef = inject(DrawerRef, { optional: true });  
  private _defaultConfig = inject(FS_FILTER_CONFIG, { optional: true });
  private _filterOverlay = inject(FsFilterOverlayService);
  private _zone = inject(NgZone);
  private _paramController = inject(ParamController);
  private _persistanceController = inject(PersistanceController);
  private _itemStore = inject(ItemStore);
  private _actions = inject(ActionsController);
  private _savedFilterController = inject(SavedFilterController);

  constructor(
  ) {
    this._itemStore.filter = this;
    this._listenWhenFilterReady();
    this._updateWindowWidth();

    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    
    iconRegistry.addSvgIconLiteral('filterOutline', sanitizer.bypassSecurityTrustHtml(FilterIcon));

    this._filterOverlay.attach$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.showFilterMenu = true;
      });

    this._filterOverlay.detach$
      .pipe(
        takeUntil(this._destroy$),
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
    return this._itemStore.values();
  }

  public get inDialog() {
    return !!this._dialogRef || !!this._drawerRef;
  }

  public get filterParamsQuery(): KeyValue {
    return this._itemStore.valuesAsQuery();
  }

  public get items() {
    return this._itemStore.items;
  }

  public get visibleItems() {
    return this._itemStore.visibleItems;
  }

  public get keywordItem(): TextItem | null {
    return this._itemStore.keywordItem;
  }

  public get itemsReady$(): Observable<boolean> {
    return this._itemStore.ready$;
  }

  public get hasFilterChips$(): Observable<boolean> {
    return this._hasFilterChips$.asObservable();
  }

  public get hasVisibleItemOrSorting(): boolean {
    return this.visibleItems.length > 0 || !!this._itemStore.sortByItem;
  }

  public get filtersBtnVisible$(): Observable<boolean> {
    return this._filtersBtnVisible$.asObservable();
  }

  public get inlineToolbar$(): Observable<boolean> {
    return combineLatest({
      keywordVisible: this._keywordVisible$.asObservable(),
      activeFilter: of(this.savedFiltersController.enabled),
    })
      .pipe(
        map(({ keywordVisible, activeFilter }) => {
          return !(keywordVisible && this._itemStore.hasKeyword) && !activeFilter;
        }),
      );
  }

  public get notInlineToolbar$(): Observable<boolean> {
    return this.inlineToolbar$
      .pipe(
        map((inline) => !inline),
      );
  }

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordVisible$.asObservable()
      .pipe(
        map((visible) => {
          return visible && this._itemStore.hasKeyword;
        }),
      );
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

  public set activeSavedFilter(savedFilter: IFilterSavedFilter) {
    this._paramController.setActiveSavedFilter(savedFilter);
  }

  public get activeSavedFilter(): IFilterSavedFilter {
    return this._savedFilterController.activeFilter;
  }

  public get savedFilters(): IFilterSavedFilter[] {
    return this._savedFilterController.savedFilters;
  }

  public get savedFiltersController(): SavedFilterController {
    return this._savedFilterController;
  }

  public ngOnInit() {
    // Avoid ngChanges error
    setTimeout(() => {
      if (this.config.autofocus) {
        this.focus();
      }
    });

    this._initAutoReload();
    this._listenInputChanges();
    this._listenInternalItemsChange();
    this._initKeywordVisibility();
    this._initOverlay();
  }

  public ngOnDestroy() {
    this._destroyFilterDrawer();

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public focus() {
    this.keywordMatInput?.focus();
  }

  public updateSort(sort: ISortingChangeEvent) {
    this._itemStore.updateSort(sort);
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
      .find((_item) => _item.name === name);

    return item?.value;
  }

  public showItem(name: string) {
    const item = this.getItem(name);

    if (item) {
      item.hide = false;

      this._itemStore.updateItemsVisiblity();
    }
  }

  public hideItem(name: string) {
    const item = this.getItem(name);

    if (!item) {
      return;
    }

    item.hide = true;

    this._itemStore.updateItemsVisiblity();
  }

  public clearItem(name: string) {
    const item = this.getItem(name);

    if (!item) {
      return;
    }

    item.clear();
  }

  public updateItemConfig(
    name: string,
    params: IUpdateFilterItemConfig,
  ): void {
    const item = this.getItem(name);

    if (!item) {
      return;
    }

    item.label = params.label ?? item.label;
    item.chipLabel = params.chipLabel ?? item.chipLabel;

    this._itemStore.updateItemsVisiblity();
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
    }

    return null;

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
    const data = this._itemStore.valuesAsQuery();
    this._sort = this._itemStore.getSort();

    if (this.config.init) {
      this.config.init(data, this._sort, this);
    }

    this._updateChipsVisibility();

    this.items
      .forEach((item) => {
        item.init(item, this);
      });
  }

  public clear(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this._itemStore.filtersClear();

    if (this.config.clear) {
      this.config.clear();
    }

    this.keyword = '';
  }

  public reload(event = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const data = this._itemStore.valuesAsQuery();
    const el = this.reloadEl?.nativeElement;

    if(el) {
      el.style.transition = 'all 0.75s 0.0s';
      el.style.transform = 'rotate(360deg)';

      setTimeout(() => {
        el.style.transition = null;
        el.style.transform = null;
      }, 1000);
    }

    if (this.config.reload) {
      this.config.reload(data, this._itemStore.getSort());
    }
  }

  public getItem(name): BaseItem<any> {
    return this.items
      .find((item) => item.name === name);
  }

  public fetchQueryParams(): void {
    this._paramController.fetchQueryParams();
  }

  /**
   * Call change callback and apply new filter values
   */
  public change() {
    const valuesAsQuery = this._itemStore.valuesAsQuery();
    const sort = this._itemStore.getSort();

    const sortingChanged = ((!sort || !this._sort) && sort !== this._sort)
      || (sort && this._sort && !objectsAreEquals(this._sort, sort));

    if (sortingChanged) {
      this._sort = sort;

      if (this.config.sortChange) {
        this.config.sortChange(valuesAsQuery, sort);
      }
    }

    if (this.config.change) {
      this.config.change(valuesAsQuery, sort);
    }

    this._updateChipsVisibility();

    // visibility for actions can depend on filters state
    this._actions.updateActionsVisibility();
  }

  /**
   * Update filter actions config
   *
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
    this._itemStore.destroyItems();
    this.config.items = items;
    this._itemStore.setConfig(this._config);
    this._paramController.initItems();
    this._updateKeyword();
  }

  public keywordChange(keyword) {
    this._keyword$.next(keyword);
  }

  public updateSortings(items: SortItem[]): void {
    this._itemStore.updateSortingItemsValues(items);
  }

  private _initFilterWithConfig(config: FilterConfig) {
    if (this.config) {
      this._itemStore.destroyItems();
    }

    config = {
      ...(this._defaultConfig || {}),
      ...config,
    };

    this._config = new FsFilterConfig(config);
    this._actions.setConfig(this._config);
    this._persistanceController.setConfig(this._config, this.inDialog);
    this._itemStore.setConfig(this._config);
    this._paramController.setConfig(this._config);

    this._updateKeyword();

    if (this.config.reloadWhenConfigChanged) {
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
    });
  }

  private _initAutoReload() {
    if(this.config.autoReload) {
      interval(this.config.autoReload.seconds * 1000)
        .pipe(
          filter(() => this.autoReload),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this.reload(null);
        });
    }
  }

  private _listenInputChanges() {
    this._keyword$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        const keywordItem = this._itemStore.keywordItem;
        keywordItem.model = value;
        this.change();
      });
  }

  private _initKeywordVisibility() {
    this._keywordVisible$.next(!!this.keywordItem && !this.keywordItem?.hide);
  }

  private _listenInternalItemsChange() {
    this._itemStore
      .itemsChange$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.keyword = this._itemStore.keywordItem?.model;
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
        this._paramController.pending$,
        this.itemsReady$,
      ])
      .pipe(
        filter(([pendingParams, itemsReady]) => !pendingParams && itemsReady),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.init();
        this._updateKeyword();

        this.ready.emit();
      });
  }

  private _updateKeyword() {
    this.keyword = this._itemStore.keywordItem?.model;
  }

  private _updateChipsVisibility() {
    const hasFilterChips = this._itemStore.items
      .some((item: BaseItem<any>) => {
        return item.isChipVisible;
      });

    this._hasFilterChips$.next(hasFilterChips);
  }
}
