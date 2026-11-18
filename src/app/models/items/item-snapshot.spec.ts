import { ItemType } from '../../enums/item-type.enum';

import { AutocompleteChipsItem } from './autocomplete-chips-item';
import { AutocompleteItem } from './autocomplete-item';
import { BaseItem } from './base-item';
import { SelectItem } from './select-item';
import { TextItem } from './text-item';


// A chip's popup takes a snapshot as it opens and puts it back when closed with Escape:
// the item ends as the popup found it, and reloads only if the popup had applied something.
function countChanges(item: BaseItem<any>): { count: number } {
  const changes = { count: 0 };

  item.valueEvent$.subscribe((event) => {
    if (event.emitChange) {
      changes.count++;
    }
  });
  changes.count = 0;

  return changes;
}

describe('Item snapshot (a chip popup closed with Escape)', () => {

  it('should put back a value the popup applied, with one reload', () => {
    const item = new TextItem({ name: 'keyword', type: ItemType.Text, label: 'Name' }, null);
    item.setValue('before', false);
    const restore = item.snapshot();
    item.setValue('after');
    const changes = countChanges(item);

    restore();

    expect(item.value).toBe('before');
    expect(changes.count).toBe(1);
  });

  it('should not reload when the popup applied nothing', () => {
    const item = new TextItem({ name: 'keyword', type: ItemType.Text, label: 'Name' }, null);
    item.setValue('same', false);
    const restore = item.snapshot();
    const changes = countChanges(item);

    restore();

    expect(changes.count).toBe(0);
  });

  it('should put back an autocomplete pick with its name, not just its id', () => {
    const item = new AutocompleteItem(
      { name: 'user', type: ItemType.AutoComplete, label: 'User' },
      null,
    );
    item.setValue({ name: 'Ada', value: 7 }, false);
    const restore = item.snapshot();
    item.setValue(null);

    restore();

    expect(item.value).toBe(7);
    expect(item.chips[0].value).toBe('Ada');
  });

  it('should put back the isolate checkbox with the select value', () => {
    const item = new SelectItem({
      name: 'state',
      type: ItemType.Select,
      label: 'State',
      multiple: true,
      isolate: { label: 'Show archived', value: 'archived' },
    }, null);
    item.setValue(['archived'], false);
    item.isolated = true;
    const restore = item.snapshot();
    item.setValue([]);
    item.isolated = false;

    restore();

    expect(item.value).toEqual(['archived']);
    expect(item.isolated).toBe(true);
  });

  it('should put back the exclude toggle with the picks it applied to', () => {
    const item = new AutocompleteChipsItem({
      name: 'region',
      type: ItemType.AutoCompleteChips,
      label: 'Region',
      exclude: {},
    }, null);
    const picks = [{ name: 'West', value: 1 }];
    item.setValue(picks, false);
    const restore = item.snapshot();
    item.setExclude(true, picks);
    const changes = countChanges(item);

    restore();

    expect(item.exclude).toBe(false);
    expect(item.value).toEqual(picks);
    expect(changes.count).toBe(1);
  });

  it('should put back an exclude toggled with no picks, without a reload', () => {
    const item = new AutocompleteChipsItem({
      name: 'region',
      type: ItemType.AutoCompleteChips,
      label: 'Region',
      exclude: {},
    }, null);
    const restore = item.snapshot();
    item.setExclude(true, []);
    const changes = countChanges(item);

    restore();

    expect(item.exclude).toBe(false);
    expect(changes.count).toBe(0);
  });

});
