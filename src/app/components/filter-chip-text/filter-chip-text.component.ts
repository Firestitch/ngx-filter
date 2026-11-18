import { ChangeDetectionStrategy, Component, input } from '@angular/core';


/**
 * A chip's words and the count of the picks it leaves out ('+2 more'). Long words are cut
 * short with an ellipsis and the count always shows, wherever a chip's text is drawn: the
 * chip row, the filters flyout and a saved filter's chips.
 */
@Component({
  selector: 'fs-filter-chip-text',
  templateUrl: './filter-chip-text.component.html',
  styleUrls: ['./filter-chip-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FsFilterChipTextComponent {

  public text = input<string>();
  // Chips naming every pick carry none.
  public more = input<number>();

}
