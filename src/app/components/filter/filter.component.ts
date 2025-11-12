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
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconAnchor } from '@angular/material/button';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { FsClearModule } from '@firestitch/clear';
import { FsFormModule } from '@firestitch/form';

import { BehaviorSubject, combineLatest, fromEvent, interval, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

import { ActionsController } from '../../classes/actions-controller';
import { FilterIcon } from '../../consts';
import { FilterHeadingDirective } from '../../directives';
import { ISortingChangeEvent, KeyValue } from '../../interfaces';
import { FsFilterAction } from '../../interfaces/action.interface';
import {
  FilterConfig,
  IFilterConfigItem,
} from '../../interfaces/config.interface';
import { IUpdateFilterItemConfig } from '../../interfaces/update-filter-item.interface';
import { FsFilterConfig } from '../../models/filter-config';
import { BaseItem } from '../../models/items/base-item';
import { SortController } from '../../services';
import { FilterController } from '../../services/filter-controller.service';
import { FsFilterOverlayService } from '../../services/filter-overlay.service';
import { FocusControllerService } from '../../services/focus-controller.service';
import { KeywordController } from '../../services/keyword-controller.service';
import { PersistanceController } from '../../services/persistance-controller.service';
import { QueryParamController } from '../../services/query-param-controller.service';
import { SavedFilterController } from '../../services/saved-filter-controller.service';
import { FsFilterActionsComponent } from '../actions/actions.component';
import { FsFilterChipsComponent } from '../filter-chips/filter-chips.component';
import { KeywordInputComponent } from '../keyword-input/keyword-input.component';
import { FsSavedFilterAutocompleteChipsComponent } from '../saved-filter/saved-filter-autocomplete-chips/saved-filter-autocomplete-chips.component';

import { FilterStatusBarDirective } from './../../directives/status-bar.directive';
import { FS_FILTER_CONFIG } from './../../injectors/filter-config';


@Component({
  selector: 'fs-filter',
  styleUrls: ['./filter.component.scss'],
  templateUrl: './filter.component.html',
  providers: [
    FsFilterOverlayService,
    PersistanceController,
    QueryParamController,
    FocusControllerService,
    FilterController,
    SavedFilterController,
    ActionsController,
    KeywordController,
    SortController,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FsSavedFilterAutocompleteChipsComponent,
    NgClass,
    MatIcon,
    FormsModule,
    FsFormModule,
    FsClearModule,
    FsFilterChipsComponent,
    FsFilterActionsComponent,
    MatIconAnchor,
    MatSlideToggle,
    AsyncPipe,
    KeywordInputComponent,
  ],
})
export class FilterComponent implements OnInit, OnDestroy {

  @ViewChild(KeywordInputComponent)
  public keywordInput: KeywordInputComponent;
  
  @Input('config') public set setFilterConfig(value: FilterConfig) {
    this._filterConfig = value;
  }

  @Output() public closed = new EventEmitter<any>();
  @Output() public opened = new EventEmitter<any>();
  @Output() public ready = new EventEmitter<void>();

  @ContentChild(FilterStatusBarDirective)
  public statusBar: FilterStatusBarDirective;

  @ContentChild(FilterHeadingDirective, { read: TemplateRef })
  public headingTemplate: TemplateRef<any>;

  @ViewChild('reloadEl', { read: ElementRef })
  public reloadEl: ElementRef;

  @HostBinding('class.filters-open')
  public showFilterMenu = false;

  @HostBinding('class.window-desktop')
  public windowDesktop = false;

  @HostBinding('class.fs-filter')
  public fsFilterClass = true;

  private _config: FsFilterConfig;
  private _filterConfig: FilterConfig;
  private _filtersVisible$ = new BehaviorSubject(true);
  private _hasFilterChips$ = new BehaviorSubject(false);
  private _destroy$ = new Subject<void>();
  private _defaultConfig = inject(FS_FILTER_CONFIG, { optional: true });
  private _filterOverlay = inject(FsFilterOverlayService);
  private _zone = inject(NgZone);
  private _actionsController = inject(ActionsController);
  private _filterController = inject(FilterController);
  private _sortController = inject(SortController);
  private _savedFilterController = inject(SavedFilterController);
  private _keywordController = inject(KeywordController);

  constructor(
  ) {
    this._filterController.filter = this;
    this._updateWindowWidth();
    this._listenWindowResize();
    this._initIcon();
  }

  public get queryParams(): KeyValue {
    return this._filterController.queryParam;
  }

  public get query(): KeyValue {
    return this._filterController.query;
  }

  public get values(): KeyValue {
    return this._filterController.values;
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
  public set values(values) {
    this._filterController.values = values;
  }

  public get config(): FsFilterConfig {
    return this._config;
  }

  public get items(): BaseItem<IFilterConfigItem>[] {
    return this._filterController.items;
  }

  public change() {
    this._filterController.change();
  }

  public get hasHeading(): boolean {
    return !!this.headingTemplate || !!this.config.heading;
  }

  public get hasFilterChips$(): Observable<boolean> {
    return this._hasFilterChips$.asObservable();
  }

  public get filtersVisible$(): Observable<boolean> {
    return combineLatest({
      filtersVisible: this._filtersVisible$.asObservable(),
      hasVisibleItems: of(
        this.items
          .some((item) => !item.hidden && !item.isTypeKeyword),
      ),
    })
      .pipe(
        map(({ filtersVisible, hasVisibleItems }) => {
          return filtersVisible && hasVisibleItems;
        }),
      );
  }

  public get keywordVisible$(): Observable<boolean> {
    return this._keywordController.keywordVisible$;
  }

  public get keywordFullWidth$(): Observable<boolean> {
    return this._keywordController.keywordFullWidth$;
  }

  public get filterInputVisible$(): Observable<boolean> {
    return combineLatest({
      keywordVisible: this.keywordVisible$,
      savedFilterVisible: of(this.savedFilterController.enabled),
    })
      .pipe(
        map(({ keywordVisible, savedFilterVisible }) => {
          return keywordVisible || savedFilterVisible;
        }),
      );
  }

  public get actionsVisible$() {
    return this._actionsController.visible$;
  }

  public get actions$() {
    return this._actionsController.actions$;
  }

  public get menuActions$() {
    return this._actionsController.menuActions$;
  }

  public get savedFilterController(): SavedFilterController {
    return this._savedFilterController;
  }

  public get sortController(): SortController {
    return this._sortController;
  }

  public ngOnInit() {
    const config = {
      ...(this._defaultConfig || {}),
      ...this._filterConfig,
    };

    this._config = new FsFilterConfig(config);
    this._actionsController.setConfig(this.config);

    this._initItems();
    this._initAutoReload();
    this._initOverlay();
  }

  public ngOnDestroy() {
    this._destroyFilterDrawer();

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public focus() {
    this.keywordInput?.focus();
  }

  public updateSort(sort: ISortingChangeEvent, emitChange: boolean = true) {
    this._sortController.updateSort(sort, emitChange);
  }

  public hideDrawer() {
    this.closed.emit();
    this._destroyFilterDrawer();
  }

  public showDrawer() {
    this._listenEscButton();

    this.opened.emit();

    this._filterOverlay.open();
  }

  public filterButtonClick(event = null) {
    event.stopPropagation();

    if (this._filterOverlay.opened()) {
      this.hideDrawer();
    } else {
      this.showDrawer();
    }
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
    this.getItem(name)?.show();
  }

  public hideItem(name: string) {
    this.getItem(name)?.hide();
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
  }

  public clear(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this._filterController.filtersClear();

    if (this.config.clear) {
      this.config.clear();
    }

    this.keywordInput?.clear();
  }

  public reload(event = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const el = this.reloadEl?.nativeElement;

    if(el) {
      el.style.transition = 'all 0.75s 0.0s';
      el.style.transform = 'rotate(360deg)';

      setTimeout(() => {
        el.style.transition = null;
        el.style.transform = null;
      }, 1000);
    }

    this.change();
  }

  public getItem(name): BaseItem<any> {
    return this.items
      .find((item) => item.name === name);
  }

  /**
   * @deprecated Use item(name).value$ instead
   */
  public getItemValueChange$(name: string) {
    return this.getItem(name).value$;
  }

  /**
   * Update filter actions config
   *
   * @param actions
   */
  public updateActions(actions: FsFilterAction[]): void {
    this._actionsController.initActions(actions);
  }

  /**
   * Show "Filters" button
   */
  public showFilters(): void {
    this._filtersVisible$.next(true);
  }

  /**
   * Hide "Filters" button
   */
  public hideFilters(): void {
    this._filtersVisible$.next(false);
  }

  /**
   * Show "Keyword" field if it present
   */
  public showKeywordField(): void {
    this._keywordController.show();
  }

  /**
   * Hide "Keyword" field if it present
   */
  public hideKeywordField(): void {
    this._keywordController.hide();
  }

  /**
   * Go through actions and check show() callback and update visible actions
   */
  public updateActionsVisibility(): void {
    this._actionsController.updateActionsVisibility();
  }

  /**
   * Go through actions and check disabled() callback and update disabled state
   */
  public updateDisabledState(): void {
    this._actionsController.updateDisabledState();
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
            this.hideDrawer();
          });
        });
    });
  }

  private _initIcon() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('filterOutline', sanitizer.bypassSecurityTrustHtml(FilterIcon));
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

  private _initItems() {
    this._filterController.init(this.config);
  }

  private _initAutoReload() {
    if(this.config.autoReload) {
      interval(this.config.autoReload.seconds * 1000)
        .pipe(
          filter(() => this.config.autoReload.enabled),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this.reload(null);
        });
    }
  }

  private _initOverlay() {
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

    this._filterOverlay.setClearFn(this.clear.bind(this));
    this._filterOverlay.setDoneFn(this.hideDrawer.bind(this));
  }
}
