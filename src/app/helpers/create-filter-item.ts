import {
  IFilterConfigAutocompleteItem,
  IFilterConfigDateItem,
  IFilterConfigDateRangeItem,
  IFilterConfigRangeItem, IFilterConfigTextItem,
} from '../interfaces/item-config.interface';
import { SelectItem } from '../models/items/select-item';
import { ChipsItem } from '../models/items/chips-item';
import { IFilterConfigChipsItem } from '../interfaces/items/chips.interface';
import { RangeItem } from '../models/items/range-item';
import { DateRangeItem } from '../models/items/date-range-item';
import { DateTimeRangeItem } from '../models/items/date-time-range-item';
import { DateItem } from '../models/items/date-item';
import { DateTimeItem } from '../models/items/date-time-item';
import { AutocompleteItem } from '../models/items/autocomplete-item';
import { AutocompleteChipsItem } from '../models/items/autocomplete-chips-item';
import { CheckboxItem } from '../models/items/checkbox-item';
import { IFilterConfigCheckboxItem } from '../interfaces/items/checkbox.interface';
import { TextItem } from '../models/items/text-item';
import { IFilterConfigItem } from '../interfaces/config.interface';
import { ItemType } from '../enums/item-type.enum';


export function createFilterItem(item: IFilterConfigItem, config: any) {
  switch (item.type) {
    case ItemType.Select: {
      return SelectItem.create(item);
    }

    case ItemType.Chips: {
      return ChipsItem.create(item as IFilterConfigChipsItem);
    }

    case ItemType.Range: {
      return RangeItem.create(item as IFilterConfigRangeItem, config);
    }

    case ItemType.DateRange: {
      return DateRangeItem.create(item as IFilterConfigDateRangeItem);
    }

    case ItemType.DateTimeRange: {
      return DateTimeRangeItem.create(item as IFilterConfigDateRangeItem);
    }

    case ItemType.Date: {
      return DateItem.create(item as IFilterConfigDateItem);
    }

    case ItemType.DateTime: {
      return DateTimeItem.create(item as IFilterConfigDateItem);
    }

    case ItemType.AutoComplete: {
      return AutocompleteItem.create(item as IFilterConfigAutocompleteItem);
    }

    case ItemType.AutoCompleteChips: {
      return AutocompleteChipsItem.create(item as IFilterConfigAutocompleteItem);
    }

    case ItemType.Checkbox: {
      return CheckboxItem.create(item as IFilterConfigCheckboxItem);
    }

    case ItemType.Keyword: case ItemType.Text: {
      return TextItem.create(item as IFilterConfigTextItem);
    }
  }
}
