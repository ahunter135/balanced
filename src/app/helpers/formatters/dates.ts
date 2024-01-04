import { NumberMonthYear, LocaleStringMonthYear } from '../../types/dates/dates';

export function getNumberMonthYearFromDate(date?: Date): NumberMonthYear {
  if (!date) date = new Date();
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

export function getStartAndEndOfMonth(date?: Date | NumberMonthYear): { start: Date, end: Date } {
  if (!date) date = new Date();
  if (!(date instanceof Date)) date = new Date(date.year, date.month, 1);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0,
                      23, 59, 59, 999);
  return { start, end };
}

export function getMonthYearLocaleString(date?: Date | NumberMonthYear): LocaleStringMonthYear {
  if (!date) date = new Date();
  if (!(date instanceof Date)) date = new Date(date.year, date.month, 1);
  return {
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear().toString(),
  };
}

export function getPickerYears(): Array<{ text: string, value: number}> {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear + 2;

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({ text: year.toString(), value: year, selected: false });
    }

    return years;
}
