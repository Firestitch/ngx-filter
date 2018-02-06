export interface FilterConfigItem {
    name: string;
    type: 'text' | 'select' | 'range' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'autocomplete' | 'autocompletechips' | 'checkbox';
    label: string;
    multiple?: boolean;
    groups?: any;
    wait?: boolean;
    query?: string;
    values?: any;
    values$?: any;
    selectedValue?: any;
    model?: any;
    isolate?: any;
    names?: any;
    primary?: boolean;
    search?: any;
    unchecked?: any;
    alias?: any;
    placeholder?: any;
    default?: any;
}
