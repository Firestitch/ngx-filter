import type { FilterComponent } from '../components/filter/filter.component';
import { ItemType } from '../enums/item-type.enum';
import { IFilterConfigItem } from '../interfaces/config.interface';
import { IFilterConfigKeywordItem } from '../interfaces/items';
import { IFilterConfigDateRangeItem } from '../interfaces/items/date-range.interface';
import { IFilterConfigDateItem } from '../interfaces/items/date.interface';
import { IFilterConfigWeekItem } from '../interfaces/items/week.interface';
import { AutocompleteChipsItem } from '../models/items/autocomplete-chips-item';
import { AutocompleteItem } from '../models/items/autocomplete-item';
import { CheckboxItem } from '../models/items/checkbox-item';
import { ChipsItem } from '../models/items/chips-item';
import { DateItem } from '../models/items/date-item';
import { DateRangeItem } from '../models/items/date-range-item';
import { DateTimeItem } from '../models/items/date-time-item';
import { DateTimeRangeItem } from '../models/items/date-time-range-item';
import { KeywordItem } from '../models/items/keyword-item';
import { RangeItem } from '../models/items/range-item';
import { SelectItem } from '../models/items/select-item';
import { TextItem } from '../models/items/text-item';
import { WeekItem } from '../models/items/week-item';


export function createFilterItem(item: IFilterConfigItem, filter: FilterComponent) {
  switch (item.type) {
    case ItemType.Select: {
      return SelectItem.create(item, filter);
    }

    case ItemType.Chips: {
      return ChipsItem.create(item, filter);
    }

    case ItemType.Range: {
      return RangeItem.create(item, filter);
    }

    case ItemType.DateRange: {
      return DateRangeItem.create(item as IFilterConfigDateRangeItem, filter);
    }

    case ItemType.DateTimeRange: {
      return DateTimeRangeItem.create(item as IFilterConfigDateRangeItem, filter);
    }

    case ItemType.Date: {
      return DateItem.create(item as IFilterConfigDateItem, filter);
    }

    case ItemType.Week: {
      return WeekItem.create(item as IFilterConfigWeekItem, filter);
    }

    case ItemType.DateTime: {
      return DateTimeItem.create(item as IFilterConfigDateItem, filter);
    }

    case ItemType.AutoComplete: {
      return AutocompleteItem.create(item, filter);
    }

    case ItemType.AutoCompleteChips: {
      return AutocompleteChipsItem.create(item, filter);
    }

    case ItemType.Checkbox: {
      return new CheckboxItem(item, filter);
    }

    case ItemType.Keyword: {
      return KeywordItem.create(item as IFilterConfigKeywordItem, filter);
    }
    
    case ItemType.Text: {
      return TextItem.create(item, filter);
    }
  }
}
