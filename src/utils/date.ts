import { CompareReturn, DatePart, Nullable, ValueOrArray } from "./types";
import { isDate, isEmpty, isNumber, isString } from "./typing";
import { compareNumbers, formatNumber, roundDown, tryParseFloat } from "./number";
import { CultureInfoFormat, DateFormat, getResolvedCultureInfoFormat } from "./cultureInfo";
import { DATE_FORMATS } from "internal";
import { getResolvedArray } from "./array";

export const getResolvedDateFormat = (format: Nullable<CultureInfoFormat<DateFormat>>) => {
	return getResolvedCultureInfoFormat(format, t => t.dateFormat);
};

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

export function tryParseDate(
	value: Date | string | number,
	// supports multiple formats; DATE_FORMATS.ISO is always checked
	formats?: ValueOrArray<CultureInfoFormat<Pick<DateFormat, "dateFormatRegExp" | "dateTimeFormatRegExp">>>
): Date | undefined {
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
		for (const format of [...getResolvedArray(formats), DATE_FORMATS.ISO]) {
			const dateFormat = getResolvedDateFormat(format);

			const dateMatch = (
				(dateFormat.dateTimeFormatRegExp && value.match(dateFormat.dateTimeFormatRegExp)) ||
				(dateFormat.dateFormatRegExp && value.match(dateFormat.dateFormatRegExp))
			);

			if (dateMatch?.groups) {
				let year = tryParseFloat(dateMatch.groups["year"]);
				const month = tryParseFloat(dateMatch.groups["month"]);
				const day = tryParseFloat(dateMatch.groups["day"]);
				const hour = tryParseFloat(dateMatch.groups["hour"]);
				const minute = tryParseFloat(dateMatch.groups["minute"]);
				const second = tryParseFloat(dateMatch.groups["second"]);
				const millisecond = tryParseFloat(dateMatch.groups["millisecond"]);

				if (
					(year && year >= 0 && year <= 9999) &&
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
								millisecond && tryParseFloat(millisecond.toString().substring(0, 3)) || 0
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

// Supports: yyyy, yy, MM, M, dd, d, H, HH, m, mm, s, ss, f
export function formatDate(
	value: Date,
	format?: CultureInfoFormat<Pick<DateFormat, "dateFormat">>
): string {
	return getResolvedDateFormat(format).dateFormat
		.replaceAll("yyyy", value.getFullYear().toString())
		.replaceAll("yy", (value.getFullYear() % 100).toString())
		.replaceAll("MM", formatNumber(value.getMonth() + 1, { minIntegerDigits: 2 }))
		.replaceAll("M", (value.getMonth() + 1).toString())
		.replaceAll("dd", formatNumber(value.getDate(), { minIntegerDigits: 2 }))
		.replaceAll("d", value.getDate().toString())
		.replaceAll("H", "")
		.replaceAll("m", "")
		.replaceAll("s", "")
		.replaceAll("f", "");
}

// Supports: yyyy, yy, MM, M, dd, d, H, HH, m, mm, s, ss
export function formatDateTime(
	value: Date,
	format?: CultureInfoFormat<Pick<DateFormat, "dateTimeFormat">> & {
		seconds?: boolean;
		milliseconds?: boolean;
	}
): string {
	const dateTimeFormat = getResolvedDateFormat(format).dateTimeFormat;

	return (
		format?.milliseconds ? dateTimeFormat.hourMinuteSecondMillisecond :
			format?.seconds ? dateTimeFormat.hourMinuteSecond :
				dateTimeFormat.hourMinute
	)
		.replaceAll("yyyy", value.getFullYear().toString())
		.replaceAll("yy", (value.getFullYear() % 100).toString())
		.replaceAll("MM", formatNumber(value.getMonth() + 1, { minIntegerDigits: 2 }))
		.replaceAll("M", (value.getMonth() + 1).toString())
		.replaceAll("dd", formatNumber(value.getDate(), { minIntegerDigits: 2 }))
		.replaceAll("d", value.getDate().toString())
		.replaceAll("HH", formatNumber(value.getHours(), { minIntegerDigits: 2 }))
		.replaceAll("H", value.getHours().toString())
		.replaceAll("mm", formatNumber(value.getMinutes(), { minIntegerDigits: 2 }))
		.replaceAll("m", value.getMinutes().toString())
		.replaceAll("ss", formatNumber(value.getSeconds(), { minIntegerDigits: 2 }))
		.replaceAll("s", value.getSeconds().toString())
		.replaceAll("fffff", value.getMilliseconds().toString())
		.replaceAll("ffff", value.getMilliseconds().toString())
		.replaceAll("fff", value.getMilliseconds().toString())
		.replaceAll("ff", value.getMilliseconds().toString())
		.replaceAll("f", value.getMilliseconds().toString());
}
