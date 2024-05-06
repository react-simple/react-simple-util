import { CompareReturn, DatePart, Nullable, ValueOrArray } from "./types";
import { getResolvedArray, isDate, isEmpty, isNumber, isString } from "./typing";
import { compareNumbers, formatNumberISO, formatNumberLocal, roundDown, tryParseFloatISO } from "./number";
import { CultureInfoDateFormat } from "./cultureInfo";
import { DATE_FORMATS } from "internal";
import { REACT_SIMPLE_UTIL } from "data";

export interface DateTimeFormatOptions {
	seconds?: boolean;
	milliseconds?: boolean;

	// shift time zone offset before converting
	// - specifying 'true' results the same behavior how date.toString() works
	// - specifying 'false' results the same behavior how date.toLocalDateString() works
	utc?: boolean; 
}

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

// uses REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT or the specified format/culture to parse
export function tryParseDate(value: Date | string | number, formats: ValueOrArray<CultureInfoDateFormat>): Date | undefined {
	if (!value) {
		return undefined;
	}
	else if (isDate(value)) {
		return value;
	}
	else if (isNumber(value)) {
		return new Date(value);
	}
	else if (!isString(value)) {
		return undefined;
	}
	else {
		for (const format of getResolvedArray(formats)) {
			const dateFormat = format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat;

			const dateMatch = (
				(dateFormat.dateTimeFormatRegExp && value.match(dateFormat.dateTimeFormatRegExp)) ||
				(dateFormat.dateFormatRegExp && value.match(dateFormat.dateFormatRegExp))
			);

			if (dateMatch?.groups) {
				let year = tryParseFloatISO(dateMatch.groups["year"]);
				const month = tryParseFloatISO(dateMatch.groups["month"]);
				const day = tryParseFloatISO(dateMatch.groups["day"]);
				const hour = tryParseFloatISO(dateMatch.groups["hour"]);
				const minute = tryParseFloatISO(dateMatch.groups["minute"]);
				const second = tryParseFloatISO(dateMatch.groups["second"]);
				const millisecond = tryParseFloatISO(dateMatch.groups["millisecond"]);

				if (
					(!isEmpty(year) && year >= 0 && year <= 9999) &&
					(month && month >= 1 && month <= 12) &&
					(day && day >= 1 && day <= getDaysInMonth(month - 1))
				) {
					if (year < 100) {
						year += roundDown(getToday().getFullYear(), 1000); // 2000 for a while
					}

					if (
						(!isEmpty(hour) && hour >= 0 && hour <= 23) &&
						(!isEmpty(minute) && minute >= 0 && minute <= 59) &&
						(!isEmpty(second) && second >= 0 && second <= 59)
					) {
						// with time
						try {
							return new Date(
								year, month - 1, day,
								hour, minute, second,
								millisecond && tryParseFloatISO(millisecond.toString().substring(0, 3)) || 0
							);
						}
						catch {
						}
					}
					else {
						// without time
						try {
							return new Date(year, month - 1, day);
						}
						catch {
						}
					}
				}
			}
		}
	}

	return undefined;
}

// uses REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT or the specified format/culture to parse
export function tryParseDateISO(value: Date | string | number): Date | undefined {
	return tryParseDate(value, DATE_FORMATS.ISO);
}

export function tryParseDateLocal(value: Date | string | number): Date | undefined {
	return tryParseDate(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat);
}

export function tryParseDateLocalOrISO(value: Date | string | number): Date | undefined {
	return tryParseDate(value, [DATE_FORMATS.ISO, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat]);
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

export function formatDate(
	value: Date,
	format: Pick<CultureInfoDateFormat, "dateFormat">,
	options?: Pick<DateTimeFormatOptions, "utc">
): string {
	if (options?.utc) {
		value = dateAdd(value, "minute", value.getTimezoneOffset());
	}

	return (format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat).dateFormat
		.replaceAll("yyyy", value.getFullYear().toString())
		.replaceAll("yy", (value.getFullYear() % 100).toString())
		.replaceAll("MM", formatNumberLocal(value.getMonth() + 1, { minIntegerDigits: 2 }))
		.replaceAll("M", (value.getMonth() + 1).toString())
		.replaceAll("dd", formatNumberLocal(value.getDate(), { minIntegerDigits: 2 }))
		.replaceAll("d", value.getDate().toString())
		.replaceAll("H", "")
		.replaceAll("m", "")
		.replaceAll("s", "")
		.replaceAll("f", "")
		.replaceAll("Z", options?.utc ? "Z" : "");
}

export function formatDateISO(value: Date, options?: Pick<DateTimeFormatOptions, "utc">): string {
	return formatDate(value, DATE_FORMATS.ISO, options);
}

export function formatDateLocal(value: Date): string {
	return formatDate(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat);
}

export function formatDateTime(
	value: Date,
	format: Pick<CultureInfoDateFormat, "dateTimeFormat">,
	options?: DateTimeFormatOptions
): string {
	const dateTimeFormat = (format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat).dateTimeFormat;

	if (options?.utc) {
		value = dateAdd(value, "minute", value.getTimezoneOffset());
	}

	return (
		options?.milliseconds ? dateTimeFormat.hourMinuteSecondMillisecond :
			options?.seconds ? dateTimeFormat.hourMinuteSecond :
				dateTimeFormat.hourMinute
	)
		.replace("yyyy", value.getFullYear().toString())
		.replace("yy", (value.getFullYear() % 100).toString())
		.replace("MM", formatNumberISO(value.getMonth() + 1, { minIntegerDigits: 2 }))
		.replace("M", (value.getMonth() + 1).toString())
		.replace("dd", formatNumberISO(value.getDate(), { minIntegerDigits: 2 }))
		.replace("d", value.getDate().toString())
		.replace("HH", formatNumberISO(value.getHours(), { minIntegerDigits: 2 }))
		.replace("H", value.getHours().toString())
		.replace("mm", formatNumberISO(value.getMinutes(), { minIntegerDigits: 2 }))
		.replace("m", value.getMinutes().toString())
		.replace("ss", formatNumberISO(value.getSeconds(), { minIntegerDigits: 2 }))
		.replace("s", value.getSeconds().toString())
		.replace("fff", formatNumberISO(value.getMilliseconds(), { minIntegerDigits: 3 }))
		.replace("ff", formatNumberISO(value.getMilliseconds(), { minIntegerDigits: 2 }))
		.replace("f", formatNumberISO(value.getMilliseconds(), { minIntegerDigits: 1 }))
		.replace("Z", options?.utc ? "Z" : "");
}

export function formatDateTimeISO(value: Date, options?: Pick<DateTimeFormatOptions, "utc">): string {
	return formatDateTime(value, DATE_FORMATS.ISO, { seconds: true, milliseconds: true, utc: options?.utc });
}

export function formatDateTimeLocal(value: Date, options?: DateTimeFormatOptions): string {
	return formatDateTime(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat, options);
}
