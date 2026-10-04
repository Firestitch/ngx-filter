import { isEqual } from 'lodash-es';

import type { FilterComponent } from '../../components/filter/filter.component';
import { encodeQueryParam } from '../../helpers/encode-query-parm';
import { getExcludeName } from '../../helpers/get-exclude-name';
import { normalizeCompareValue } from '../../helpers/normalize-compare-value';
import {
  FilterAutocompleteChipsExcludeValue,
} from '../../interfaces/items/autocomplete-chips-exclude-value.interface';
import {
  FilterAutocompleteChipsShape,
  FilterAutocompleteChipsTemplateFn,
  IFilterConfigAutocompleteChipsItem,
} from '../../interfaces/items/autocomplete-chips.interface';

import { BaseAutocompleteItem } from './base-autocomplete-item';


/** What a selection holds once it has been picked: the option's label and its id. */
interface IAutocompleteChipsSelection {
  name: string;
  value: string | number;
}


export class AutocompleteChipsItem
  extends BaseAutocompleteItem<IFilterConfigAutocompleteChipsItem> {

  public declare multiple: boolean;
  public declare shape: FilterAutocompleteChipsShape;
  public declare chipImage: string;
  public declare chipIcon: string;
  public declare chipColor: string;
  public declare chipIconColor: string;
  public declare chipBackground: string;
  public declare chipClass: string;
  public declare template?: FilterAutocompleteChipsTemplateFn;
  public declare subTemplate?: FilterAutocompleteChipsTemplateFn;
  public declare panelActions: {
    label: string;
    click: (filter: FilterComponent) => void;
  }[];
  // True when the config has `exclude`: the list shows the toggle, and only then does an
  // excluding value count.
  public declare excludable: boolean;
  public declare excludeLabel: string;
  public declare panelNote: (() => string | null) | null;

  private _exclude = false;

  constructor(
    itemConfig: IFilterConfigAutocompleteChipsItem,
    protected _filter: FilterComponent,
  ) {
    super(itemConfig, _filter);
    this.multiple = itemConfig.multiple ?? true;
    this.shape = itemConfig.shape ?? 'roundChip';
    this.chipImage = itemConfig.chipImage ?? 'image';
    this.chipIcon = itemConfig.chipIcon;
    this.chipIconColor = itemConfig.chipIconColor;
    this.chipColor = itemConfig.chipColor;
    this.chipBackground = itemConfig.chipBackground;
    this.chipClass = itemConfig.chipClass;
    this.template = itemConfig.template;
    this.subTemplate = itemConfig.subTemplate;
    this.panelActions = itemConfig.panelActions || [];
    this.excludable = !!itemConfig.exclude;
    this.excludeLabel = itemConfig.exclude?.label ?? 'Exclude these';
    this.panelNote = itemConfig.panelNote ?? null;
  }

  public static create(config: IFilterConfigAutocompleteChipsItem, filter: FilterComponent) {
    return new AutocompleteChipsItem(config, filter);
  }

  /** Whether the picks are left out (the exclude toggle is on) rather than kept. */
  public get exclude(): boolean {
    return this._exclude;
  }

  /**
   * The picks as they are stored while they are an include, which is the shape this item
   * has always had. With exclude on they come with the mode
   * (FilterAutocompleteChipsExcludeValue), so a persisted, saved or URL value brings the
   * mode back with it.
   */
  public get value() {
    if(this._exclude && this.hasValue) {
      return { exclude: true, selected: super.value };
    }

    return super.value;
  }

  /**
   * Pairs with the getter above: a getter-only override makes the accessor read-only.
   * Compared with the stored picks, not the getter, which builds a new object each time.
   */
  public set value(value) {
    if(value !== super.value) {
      this.setValue(value);
    }
  }

  /**
   * The selections as a list regardless of `multiple`, so everything downstream —
   * query, chips, query params — has one shape to work with.
   */
  public get selected(): IAutocompleteChipsSelection[] {
    if(!this.hasValue) {
      return [];
    }

    return this.multiple ? super.value : [super.value];
  }

  /**
   * An excludable item writes both keys every time, the one it is not using as undefined:
   * a host that merges this into the URL key by key would otherwise keep a stale <name>
   * next to exclude<Name>, or the reverse.
   */
  public get queryParam(): Record<string, unknown> {
    const params = this.excludable
      ? { [this.name]: undefined, [getExcludeName(this.name)]: undefined }
      : {};

    if(!this.hasValue) {
      return params;
    }

    return {
      ...params,
      [this._queryName]: this.selected
        .filter((item) => !!item.value)
        .map((item) =>{
          return `${item.value}:${encodeQueryParam(item.name)}`;
        })
        .join(','),
    };
  }

  public get query(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    const value = super.value;

    // A single select carries one value, so it reads back as that value rather than as a
    // one-element list — the same shape ItemType.AutoComplete produces.
    if(!this.multiple) {
      return {
        [this._queryName]: value && typeof value === 'object' ? value.value : value,
      };
    }

    if (!Array.isArray(value)) {
      return {
        [this._queryName]: value,
      };
    }

    return {
      [this._queryName]: value
        .filter((item) => !!item.value)
        .map((item) => item.value)
        .join(','),
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.hasValue) {
      return [];
    }

    const names = this.selected
      .map((i) => (`${i.name}`).trim())
      .join(', ');

    // Left-out picks say so before the label: 'Exclude Region: West, East'.
    return [
      {
        value: names,
        label: this._exclude ? `Exclude ${this.label}` : this.label,
      },
    ];
  }

  public get hasValue() {
    if(this.multiple) {
      return Array.isArray(super.value) && super.value.length > 0;
    }

    return super.value !== null && super.value !== undefined;
  }

  /**
   * The base compare reads the stored picks, which leave the mode out, so an excluding
   * default would always look changed. This one compares picks and mode on both sides.
   */
  public get hasNonDefaultValue() {
    if(!this.hasValue) {
      return false;
    }

    return !isEqual(
      normalizeCompareValue(this._comparable(this.value)),
      normalizeCompareValue(this._comparable(this.defaultValue)),
    );
  }

  /**
   * Normalizes whatever arrives — the component hands back an array when multiple and a
   * bare object otherwise, while stored/query-param values always parse as a list — into
   * the shape this item is configured for.
   *
   * A FilterAutocompleteChipsExcludeValue sets the mode with the picks; a plain list or
   * pick is an include. An item without `exclude` drops an excluding value: keeping its
   * picks as an include would turn 'leave these out' into 'only these'.
   */
  public setValue(value, emitChange = true) {
    let picks = value;
    this._exclude = false;

    if(this._isExcludeValue(value)) {
      const excluding = !!value.exclude;
      this._exclude = excluding && this.excludable;
      picks = excluding && !this.excludable ? null : value.selected;
    }

    if(this.multiple) {
      super.setValue(Array.isArray(picks) ? picks : [], emitChange);

      return;
    }

    super.setValue(Array.isArray(picks) ? picks[0] ?? null : picks ?? null, emitChange);
  }

  /**
   * Applies the list's picks in the mode the item is already in. The same picks it holds
   * are nothing to apply, so closing the list untouched fires no change.
   */
  public setSelected(selected: unknown) {
    if(selected === super.value) {
      return;
    }

    this.setValue(this._exclude ? { exclude: true, selected } : selected);
  }

  /**
   * Turns exclude on or off and keeps the picks: the list's own, which a multi select
   * has not applied yet. With no picks before or after there is no query to change.
   */
  public setExclude(exclude: boolean, selected: unknown = super.value) {
    const picked = Array.isArray(selected) ? selected.length > 0 : !!selected;

    this.setValue({ exclude, selected }, this.hasValue || picked);
  }

  private get _queryName(): string {
    return this._exclude ? getExcludeName(this.name) : this.name;
  }

  private _isExcludeValue(value: unknown): value is FilterAutocompleteChipsExcludeValue {
    return !!value && typeof value === 'object' && !Array.isArray(value)
      && 'exclude' in value && 'selected' in value;
  }

  /** Picks and mode, with an include written as plain picks whichever form it came in. */
  private _comparable(value: unknown): unknown {
    if(!this._isExcludeValue(value)) {
      return value;
    }

    if(!value.exclude) {
      return value.selected;
    }

    // The same drop setValue makes on an item without `exclude`.
    if(!this.excludable) {
      return this.multiple ? [] : null;
    }

    return { exclude: true, selected: value.selected };
  }

}
