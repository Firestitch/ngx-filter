import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';


import { FsMessage } from '@firestitch/message';

import { Observable, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../../injectors/filter-drawer-overlay';
import { BaseItem } from '../../models/items/base-item';
import { ExternalParamsController } from '../../services/external-params-controller.service';
import { FsFilterItemsStore } from '../../services/items-store.service';
import { SavedFiltersController } from '../../services/saved-filters-controller.service';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FilterItemComponent } from '../filters-item/filter-item.component';
import { FsFilterDrawerActionsComponent } from '../filter-drawer-actions/filter-drawer-actions.component';
import { AsyncPipe } from '@angular/common';

type Item = BaseItem<any>;

@Component({
    templateUrl: './filter-drawer.component.html',
    styleUrls: ['./filter-drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        FsSkeletonModule,
        FilterItemComponent,
        FsFilterDrawerActionsComponent,
        AsyncPipe,
    ],
})
export class FilterDrawerComponent implements OnInit {

  @Input() public inline = false;

  public windowDesktop = false;
  public savedFilterName = '';

  protected _clear: () => void;
  protected _done: () => void;
  protected _destroyRef = inject(DestroyRef);

  private _savedFiltersController = inject(SavedFiltersController);
  private _message = inject(FsMessage);
  private _itemsStore = inject(FsFilterItemsStore);
  private _overlayRef = inject(FILTER_DRAWER_OVERLAY);
  private _data = inject(FILTER_DRAWER_DATA);
  private _externalParams = inject(ExternalParamsController);

  constructor(
  ) {
    this._itemsStore.prepareItems();
    this._clear = this._data.clear;
    this._done = this._data.done;

    this.updateWindowWidth();
  }

  @HostListener('window:resize')
  public updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  public get items$(): Observable<Item[]> {
    return this._itemsStore.visibleItems$;
  }

  public get externalParams(): ExternalParamsController {
    return this._externalParams;
  }

  public get savedFiltersController(): SavedFiltersController {
    return this._savedFiltersController;
  }

  public ngOnInit(): void {
    this._savedFiltersController.activeFilter$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((activeFilter) => {
        this.savedFilterName = activeFilter?.name || '';
      });
  }

  public clear() {
    this._clear();
  }

  public done() {
    this._done();
    this._overlayRef.detach();
  }

  public backdropClick() {
    this.done();
  }

  public saveSavedFilter = () => {
    return this._savedFiltersController
      .save({ name: this.savedFilterName })
      .pipe(
        tap((savedFilter) => {
          this._savedFiltersController.setActiveFilter(savedFilter);
          this._message
            .success(`Saved ${this._savedFiltersController.singularLabel}`, { 
              positionClass: 'toast-bottom-left', 
            });
        }),
      );
  };
}
