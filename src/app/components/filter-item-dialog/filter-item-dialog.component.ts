import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';


import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';


import { FILTER_DRAWER_DATA } from '../../injectors';
import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items';
import { FilterItemComponent } from '../filters-item/filter-item.component';

@Component({
  templateUrl: './filter-item-dialog.component.html',
  styleUrls: ['./filter-item-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsFormModule,
    FsSkeletonModule,
    FilterItemComponent,
  ],
})
export class FilterItemDialogComponent {

  public item: BaseItem<IFilterConfigItem> = inject(FILTER_DRAWER_DATA)?.item;
  public autofocusName: string = inject(FILTER_DRAWER_DATA)?.autofocusName;

}
