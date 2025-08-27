import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';

import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { map, mapTo, startWith } from 'rxjs/operators';

import { IFilterConfigItem } from '../../interfaces/config.interface';
import { BaseItem } from '../../models/items/base-item';
import { FocusControllerService } from '../../services/focus-controller.service';
import { FsFilterChipContentComponent } from '../filter-chip-content/filter-chip-content.component';


@Component({
  selector: 'fs-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipModule,
    NgTemplateOutlet,
    FsFilterChipContentComponent,
    AsyncPipe,
  ],
})
export class FsFilterChipComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<IFilterConfigItem>;

  @Input() public removable: boolean = false;

  @Input() public chips: { name?: string, value: string, label: string }[];

  @Input() 
  @HostBinding('class.clickable') 
  public clickable: boolean = false;

  public rangeItem: boolean;

  public chipDelayedRender$: Observable<boolean>;

  private _chipRenderTimer$ = timer(500)
    .pipe(
      mapTo(true),
    );

  private _destroy$ = new Subject();
  private _cdRef = inject(ChangeDetectorRef);
  private _focusController = inject(FocusControllerService);

  public ngOnInit() {
    // this.rangeItem = this.item.isTypeDateRange
    //   || this.item.isTypeRange
    //   || this.item.isTypeDateTimeRange;

    // this.listenValueChangesForRanges();
    //   this._initDelayRender();
    // }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public click(chip: { name?: string, value: string, label: string }) {
    if (this.clickable) {
      this._focusController.click(this.item, chip.name);
    }
  }

  public remove(chip: { name?: string, value: string, label: string }) {
    this.item.clear(chip.name);
  }

  public listenValueChangesForRanges() {
    // this.item.valueChange$
    //   .pipe(
    //     takeUntil(this._destroy$),
    //   )
    //   .subscribe(() => {
    //     this._cdRef.markForCheck();
    //   });
  }

  private _initDelayRender() {
    this.chipDelayedRender$ = combineLatest([
      this.item.values$,
      this._chipRenderTimer$.pipe(startWith(false)),
    ])
      .pipe(
        map(([values, timerValue]) => {
          return !!values || timerValue;
        }),
      );
  }
}
