import { getPickerYears } from "src/app/helpers/formatters/dates";

export const MONTH_NAMES_AND_VALUES = [
  { text: 'January', value: 0 },
  { text: 'February', value: 1 },
  { text: 'March', value: 2 },
  { text: 'April', value: 3 },
  { text: 'May', value: 4 },
  { text: 'June', value: 5 },
  { text: 'July', value: 6 },
  { text: 'August', value: 7 },
  { text: 'September', value: 8 },
  { text: 'October', value: 9 },
  { text: 'November', value: 10 },
  { text: 'December', value: 11 },
];

export const PICKER_YEAR_NAMES_AND_VALUES = getPickerYears();
