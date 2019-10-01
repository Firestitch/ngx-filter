import { ChangeDetectionStrategy, Component, } from '@angular/core';

@Component({
  selector: 'filter-item-select-backdrop',
  styleUrls: ['./backdrop.component.scss'],
  templateUrl: './backdrop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBackdropComponent {
  constructor() {}
}
