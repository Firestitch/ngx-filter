import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterComponent, FilterConfig, FsFilterModule } from '@firestitch/filter';

import { ExampleLogService, ExampleUser, FilterItemsService } from '../../../services';


/**
 * The four things an autocomplete-chips item can be told about its chips: how many it
 * holds, what shape they take, whether they carry an image, and what goes on their
 * second line.
 *
 * `template` and `subTemplate` are both handed the value object the item's `values` fn
 * produced — here that is a whole user — and each returns the string for its line. So
 * `values` hands back records and the templates decide the wording, including fields
 * like a title or an email that never make it into the query.
 */
@Component({
  selector: 'autocomplete-chips-items',
  templateUrl: './autocomplete-chips-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsFilterModule, JsonPipe],
})
export class AutocompleteChipsItemsComponent {

  public query: unknown = null;

  public conf: FilterConfig;

  private _filterItems = inject(FilterItemsService);
  private _log = inject(ExampleLogService);

  constructor() {
    this.conf = {
      chips: true,
      persist: false,
      // Enough to keep every item on the chip row instead of behind "More filters".
      minSecondaryItems: 5,
      change: (query) => {
        this.query = query;
      },
      init: (query) => {
        this.query = query;
      },
      items: [
        // multiple defaults to true, so this is the shape the item has always had: an
        // array of {name, value}, joined into one comma-separated query param.
        this._filterItems.userAutocompleteChips({
          name: 'multipleUserIds',
          label: 'Multiple',
          // Without a `template` the option renders the value object's own `name`. This
          // one formats it instead, off fields `values` returned.
          template: (user: ExampleUser) => `${user.name} (${user.title})`,
          subTemplate: (user: ExampleUser) => user.email,
        }),
        // multiple: false holds a single {name, value} and its query is the bare value,
        // the way ItemType.AutoComplete reads. Picking one closes the popup.
        this._filterItems.userAutocompleteChips({
          name: 'singleUserId',
          label: 'Single',
          multiple: false,
          subTemplate: (user: ExampleUser) => user.email,
        }),
        this._filterItems.userAutocompleteChips({
          name: 'squareUserIds',
          label: 'Square chips',
          shape: 'squareChip',
          subTemplate: (user: ExampleUser) => user.email,
        }),
        // '' opts out of the default 'image' lookup, so the chips carry no avatar.
        this._filterItems.userAutocompleteChips({
          name: 'shapelessUserIds',
          label: 'Shapeless chips',
          shape: 'none',
          chipImage: '',
        }),
        // A row pinned to the bottom of the panel, for "none of these — make a new one".
        this._filterItems.userAutocompleteChips({
          name: 'panelActionUserIds',
          label: 'With panel action',
          panelActions: [
            {
              label: 'Add a random user',
              click: (filter: FilterComponent) => {
                const users = this._filterItems.users;
                const user = users[Math.floor(Math.random() * users.length)];
                const item = filter.getItem('panelActionUserIds');

                item.value = [
                  ...item.value,
                  { value: user.id, name: user.name },
                ];

                this._log.log('Panel action added a user', user);
              },
            },
          ],
        }),
      ],
    };
  }
}
