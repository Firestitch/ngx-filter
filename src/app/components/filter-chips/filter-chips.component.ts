import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, OnInit, QueryList, StaticProvider, ViewChildren, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';

import { FsChipComponent, FsChipModule } from '@firestitch/chip';
import { FsButtonDirective } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSelectButtonModule } from '@firestitch/selectbutton';

import { BehaviorSubject, Observable, delay, take, tap } from 'rxjs';


import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ItemType } from '../../enums';
import { FILTER_DRAWER_DATA } from '../../injectors';
import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items/base-item';
import { SavedFilterController } from '../../services';
import { FilterController } from '../../services/filter-controller.service';
import { FilterItemDialogComponent } from '../filter-item-dialog';
import { FsFilterSavedFilterManageComponent } from '../saved-filter/saved-filter-manage/saved-filter-manage.component';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    FsChipModule,
    MatSelect,
    MatOption,
    FsSelectButtonModule,
    MatButtonModule,
    FsButtonDirective,
    FormsModule,
  ],
})
export class FsFilterChipsComponent implements OnInit {

  @ViewChildren(FsChipComponent) 
  public chips: QueryList<FsChipComponent>;

  public ItemType = ItemType;
  public secondaryItems: BaseItem<IFilterConfigItem>[] = [];

  private _filterController = inject(FilterController);
  private _dialog = inject(MatDialog);
  private _message = inject(FsMessage);
  private _savedFilterController = inject(SavedFilterController);
  private _injector = inject(Injector);
  private _overlay = inject(Overlay);
  private _overlayRef: OverlayRef;
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject(ElementRef);
  private _hasSecondaryValue$ = new BehaviorSubject(false);

  public get items() {
    return this._filterController.items
      .filter((item) => !item.isTypeKeyword);
  }

  public addFilter(event: MatSelectChange) {
    const item: BaseItem<IFilterConfigItem> = event.value;
    item.secondaryShow();

    this.chips.changes
      .pipe(
        take(1),
        delay(100),
        tap(() => {
          this.openChip(item);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  public get disabledItems() {
    return this.items
      .filter((item) => !item.secondaryVisible && !item.hasValue && !item.primary && item.visible);
  }

  public get hasSecondaryValue$(): Observable<boolean> {
    return this._hasSecondaryValue$.asObservable();
  }

  public get savedFilterController(): SavedFilterController {
    return this._savedFilterController;
  }

  public get hasSecondaryValue(): boolean {
    return this._filterController.items
      .some((item) => item.hasValue && item.visible && !item.primary);
  }

  public ngOnInit(): void {
    this.secondaryItems = this.items
      .filter((item) => !item.primary);

    this._initHasSecondaryValue();
  }

  public clear() {
    this._filterController.items
      .filter((item) => item.clearable)
      .forEach((item) => {
        if(!item.secondary) {
          item.secondaryHide();
        }
        item.clear(false);
      });

    this._filterController.change();
    this._savedFilterController.setActiveFilter(null);
  }

  public openChip(item: BaseItem<IFilterConfigItem>, name: string = null) {
    this._destroyOverlay();
    const el = this._elementRef.nativeElement
      .querySelector(`[data-filter-item="${item.name}"]`);

    const positions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: 0,
        offsetY: el.offsetHeight + 2,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      },
    ];

    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(el)
      .withPositions(positions);
    
    const overlayConfig = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'fs-sidenav-menu-overlay-pane',
    });

    this._overlayRef = this._overlay.create(overlayConfig);

    this._overlayRef.backdropClick().pipe(
      take(1),
      tap(() => {
        this._destroyOverlay();
      }),
      takeUntilDestroyed(this._destroyRef),
    ).subscribe();

    this._attachContainer(this._overlayRef, item, name);
  }

  public getNestedElement(el: any, className: string) {
    if(el) {
      if(el.classList.contains(className)) {
        return el;
      }

      return this.getNestedElement(el.parentElement, className);
    }

    return null;
  }
  
  public saveActiveFilter(): void {
    this._savedFilterController
      .save(this._savedFilterController.activeFilter)
      .pipe(
        tap(() => {
          this._message.success(`Saved ${this._savedFilterController.singularLabel}`);
        }),
      )
      .subscribe();
  }

  public createSavedFilter(): void {
    this._savedFilterController.create()
      .pipe(
        tap(() => {
          this._message
            .success(`Created ${this._savedFilterController.singularLabel}`,
            );
        }),
      )
      .subscribe();
  }

  public saveAs(): void {
    this._savedFilterController
      .saveAs()
      .pipe(
        tap(() => {
          this._message.success(`Saved ${this._savedFilterController.singularLabel}`);
        }),
      )
      .subscribe();
  } 

  public manageSavedFilters(): void {
    this._dialog
      .open(FsFilterSavedFilterManageComponent, {
        injector: this._injector,
        restoreFocus: false,
      });
  }

  public _destroyOverlay() {
    if(this._overlayRef) {
      this._overlayRef.detachBackdrop();
      this._overlayRef.detach();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  public removeChip(
    item: BaseItem<IFilterConfigItem>, 
    chip: { name?: string, value: string, label: string },
  ) {
    if(!item.secondary) {
      item.secondaryHide();
    }

    if(chip.name) {
      item.clearByName(chip.name);
    } else {
      item.clear();
    }
  }

  private _attachContainer(overlayRef: OverlayRef, item: BaseItem<IFilterConfigItem>, name: string) {
    const injector = this._createInjector(item, name);
    const containerPortal = new ComponentPortal(FilterItemDialogComponent, undefined, injector);
    const containerRef = overlayRef.attach<FilterItemDialogComponent>(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(item: BaseItem<IFilterConfigItem>, autofocusName: string): Injector {
    const providers: StaticProvider[] = [
      { provide: FILTER_DRAWER_DATA, useValue: { item, autofocusName, overlayRef: this._overlayRef } },
    ];
  
    return Injector.create({
      providers,
      parent: this._injector,
    });
  }

  private _initHasSecondaryValue() {
    this._hasSecondaryValue$.next(this.hasSecondaryValue);

    this._filterController.change$
      .pipe(
        tap(() => {
          this._hasSecondaryValue$.next(this.hasSecondaryValue);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

}
