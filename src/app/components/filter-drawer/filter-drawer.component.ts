import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, of, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FILTER_DRAWER_DATA } from '../../injectors/filter-drawer-data';
import { FILTER_DRAWER_OVERLAY } from '../../injectors/filter-drawer-overlay';
import { BaseItem } from '../../models/items/base-item';
import { ItemStore } from '../../services/item-store.service';
import { ParamController } from '../../services/param-controller.service';
import { SavedFilterController } from '../../services/saved-filter-controller.service';
import { FsFilterDrawerActionsComponent } from '../filter-drawer-actions/filter-drawer-actions.component';
import { FilterItemComponent } from '../filters-item/filter-item.component';

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

  private _savedFilterController = inject(SavedFilterController);
  private _message = inject(FsMessage);
  private _itemStore = inject(ItemStore);
  private _overlayRef = inject(FILTER_DRAWER_OVERLAY);
  private _data = inject(FILTER_DRAWER_DATA);
  private _paramController = inject(ParamController);

  constructor(
  ) {
    this._itemStore.prepareItems();
    this._clear = this._data.clear;
    this._done = this._data.done;

    this.updateWindowWidth();
  }

  @HostListener('window:resize')
  public updateWindowWidth() {
    this.windowDesktop = window.innerWidth > 1200;
  }

  public get items$(): Observable<Item[]> {
    return of(this._itemStore.items);
  }

  public get paramCointroller(): ParamController {
    return this._paramController;
  }

  public get savedFiltersController(): SavedFilterController {
    return this._savedFilterController;
  }

  public ngOnInit(): void {
    this._savedFilterController.activeFilter$
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
    return this._savedFilterController
      .save({ name: this.savedFilterName })
      .pipe(
        tap((savedFilter) => {
          this._savedFilterController.setActiveFilter(savedFilter);
          this._message
            .success(`Saved ${this._savedFilterController.singularLabel}`, { 
              positionClass: 'toast-bottom-left', 
            });
        }),
      );
  };
}
