import { getPickerYears } from 'src/app/helpers/formatters/dates';

export const MONTH_NAMES_AND_VALUES = [
  { text: 'January', value: 0, selected: false },
  { text: 'February', value: 1, selected: false },
  { text: 'March', value: 2, selected: false },
  { text: 'April', value: 3, selected: false },
  { text: 'May', value: 4, selected: false },
  { text: 'June', value: 5, selected: false },
  { text: 'July', value: 6, selected: false },
  { text: 'August', value: 7, selected: false },
  { text: 'September', value: 8, selected: false },
  { text: 'October', value: 9, selected: false },
  { text: 'November', value: 10, selected: false },
  { text: 'December', value: 11, selected: false },
];

export const PICKER_YEAR_NAMES_AND_VALUES = getPickerYears();
