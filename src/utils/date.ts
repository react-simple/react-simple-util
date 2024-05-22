import { CompareReturn, DatePart, Nullable } from "./types";
import { isNumber } from "./common";
import { compareNumbers } from "./number";

export function compareDates(date1: Date, date2: Date): CompareReturn {
	return compareNumbers(date1.getTime(), date2.getTime());
}

export function sameDates(date1: Nullable<Date>, date2: Nullable<Date>): boolean {
	return (
		!date1 ? !date2 :
			!date2 ? false :
				date1.getTime() === date2.getTime()
	);
}

// removes time portion
export const getDate = (date: Date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getToday = () => {
	return getDate(new Date());
};

export const getFirstDayOfMonth = (d: Date) => {
	return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getLastDayOfMonth = (d: Date) => {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0); // +1 month, -1 day
};

export const getDaysInMonth = (month: Date | number) => {
	return getLastDayOfMonth(isNumber(month) ? new Date(2000, month, 1) : month).getDate();
};

export const isDateInInterval = (d: Date, interval: { minDate?: Date, maxDate?: Date }) => {
	return (
		(!interval.minDate || compareDates(d, interval.minDate) >= 0) &&
		(!interval.maxDate || compareDates(d, interval.maxDate) <= 0)
	);
};

export function dateAdd(date: Date, part: DatePart, value: number): Date {
	return new Date(
		date.getFullYear() + (part === "year" ? value : 0),
		date.getMonth() + (part === "month" ? value : 0),
		date.getDate() + (part === "day" ? value : 0),
		date.getHours() + (part === "hour" ? value : 0),
		date.getMinutes() + (part === "minute" ? value : 0),
		date.getSeconds() + (part === "second" ? value : 0),
		date.getMilliseconds() + (part === "millisecond" ? value : 0)
	);
}

export function getDatePart(date: Date, part: DatePart): number {
	switch (part) {
		case "year": return date.getFullYear();
		case "month": return date.getMonth();
		case "day": return date.getDate();
		case "hour": return date.getHours();
		case "minute": return date.getMinutes();
		case "second": return date.getSeconds();
		case "millisecond": return date.getMilliseconds();
		default:
			return 0;
	}
}

export function setDatePart(date: Date, part: DatePart, value: number): Date {
	return new Date(
		part === "year" ? value : date.getFullYear(),
		part === "month" ? value : date.getMonth(),
		part === "day" ? value : date.getDate(),
		part === "hour" ? value : date.getHours(),
		part === "minute" ? value : date.getMinutes(),
		part === "second" ? value : date.getSeconds(),
		part === "millisecond" ? value : date.getMilliseconds()
	);
}
