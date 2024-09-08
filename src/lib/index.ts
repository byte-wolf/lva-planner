import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { getDate, getHours, getMilliseconds, getMinutes, getMonth, getSeconds, getYear } from "date-fns";

// place files you want to import through the `$lib` alias in this folder.
export function convertToCalendarDateTime(date: Date | undefined): CalendarDateTime | undefined {
    if (date === undefined) return undefined;

    return new CalendarDateTime(
        getYear(date),
        getMonth(date) + 1, // date-fns months are 0-indexed, CalendarDate expects 1-indexed
        getDate(date),
        getHours(date),
        getMinutes(date)
    );
}