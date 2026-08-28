
import type { FilterComponent } from '../../components/filter/filter.component';
import { encodeQueryParam } from '../../helpers';
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
  }

  public static create(config: IFilterConfigAutocompleteChipsItem, filter: FilterComponent) {
    return new AutocompleteChipsItem(config, filter);
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

  public get queryParam(): Record<string, unknown> {
    if(!this.hasValue) {
      return {};
    }

    return {
      [this.name]: this.selected
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
        [this.name]: value && typeof value === 'object' ? value.value : value,
      };
    }

    if (!Array.isArray(value)) {
      return {
        [this.name]: value,
      };
    }

    return {
      [this.name]: value
        .filter((item) => !!item.value)
        .map((item) => item.value)
        .join(','),
    };
  }

  public get chips(): { name?: string, value: string, label: string }[] {
    if(!this.hasValue) {
      return [];
    }

    return [
      {
        value: this.selected
          .reduce((acc, i) => {
            acc.push((`${i.name}`).trim());

            return acc;
          }, [])
          .join(', '),
        label: this.label,
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
   * Normalizes whatever arrives — the component hands back an array when multiple and a
   * bare object otherwise, while stored/query-param values always parse as a list — into
   * the shape this item is configured for.
   */
  public setValue(value, emitChange = true) {
    if(this.multiple) {
      super.setValue(Array.isArray(value) ? value : [], emitChange);

      return;
    }

    super.setValue(Array.isArray(value) ? value[0] ?? null : value ?? null, emitChange);
  }

}
