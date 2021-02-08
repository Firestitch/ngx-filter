import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseItem } from '../../models/items/base-item';
import { IFilterConfigItem } from '../../interfaces/config.interface';


@Component({
  selector: 'fs-filter-chip-content',
  templateUrl: './filter-chip-content.component.html',
  styleUrls: ['./filter-chip-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFilterChipContentComponent implements OnInit, OnDestroy {

  @Input() public item: BaseItem<IFilterConfigItem>;
  @Input() public type: 'from' | 'to';

  public content;

  private _destroy$ = new Subject();

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.listenValueChangesForRanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public listenValueChangesForRanges() {
    this.item.value$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.content = this._getContent();
        this._cdRef.detectChanges();
      });
  }

  private _getContent() {
    const result = this.item.getChipsContent(this.type);

    if (this.item.chipLabel !== undefined) {
      if (this.item.chipLabel === '') {
        return `${result}`;
      } else {
        if (Array.isArray(this.item.chipLabel)) {
          const label = getLabelFromArray(this.item.chipLabel, this.type);
          return `${label}: ${result}`;
        } else {
          return `${this.item.chipLabel}: ${result}`;
        }
      }
    } else {
      if (Array.isArray(this.item.label)) {
        const label = getLabelFromArray(this.item.label, this.type);
        return `${label}: ${result}`;
      } else {
        if (this.item.isTypeCheckbox) {
          return result;
        } else {
          return `${this.item.label}: ${result}`;
        }
      }
    }
  }
}

function getLabelFromArray(labelArr, type) {
  if (type === 'from' && labelArr[0]) {
    return `${labelArr[0]}`;
  } else if (type === 'to' && labelArr[1]) {
    return `${labelArr[1]}`;
  } else {
    return '';
  }
}
