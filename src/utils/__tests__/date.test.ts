import {
	sameDates, compareDates, tryParseDate, formatDate, formatDateTime, tryParseDateISO, tryParseDateLocal,
	formatDateLocal, formatDateTimeLocal
} from "utils";
import { REACT_SIMPLE_UTIL } from "data";

const { CULTURE_INFO } = REACT_SIMPLE_UTIL;

it('compareDates.date.equals', () => {
	expect(compareDates(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(0);
});

it('compareDates.date.less', () => {
	expect(compareDates(new Date(1999, 1, 1), new Date(2000, 1, 1))).toBe(-1);
});

it('compareDates.date.greater', () => {
	expect(compareDates(new Date(2001, 1, 1), new Date(2000, 1, 1))).toBe(1);
});

it('sameDates.date', () => {
	expect(sameDates(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(true);
});

it('tryParseDateISO.date', () => {
	expect(sameDates(tryParseDateISO("2000-01-02"), new Date(2000, 0, 2))).toBe(true);
});

it('tryParseDateISO.dateTime	', () => {
	expect(sameDates(tryParseDateISO("2000-01-02T09:10:11.12345"), new Date(2000, 0, 2, 9, 10, 11, 123))).toBe(true);
});

it('tryParseDateLocal.date', () => {
	expect(sameDates(tryParseDateLocal("1/2/2000"), new Date(2000, 0, 2))).toBe(true);
});

it('tryParseDateLocal.date.twodigityear', () => {
	expect(sameDates(tryParseDateLocal("1/2/00"), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDateLocal("1/2/10"), new Date(2010, 0, 2))).toBe(true);
});

it('tryParseDateLocal.dateTime', () => {
	expect(sameDates(tryParseDateLocal("1/2/2000 3:4:5.6789"), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
});

it('tryParseDateLocal.dateTime.twodigityear', () => {
	expect(sameDates(tryParseDateLocal("1/2/00 3:4:5.6789"), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDateLocal("1/2/10 3:4:5.6789"), new Date(2010, 0, 2, 3, 4, 5, 678))).toBe(true);
});

it('tryParseDate.cultureInfo.date', () => {
	expect(sameDates(tryParseDate("2000.1.2.", CULTURE_INFO.HU), new Date(2000, 0, 2))).toBe(true);
});

it('tryParseDate.cultureInfo.dateTime', () => {
	expect(sameDates(tryParseDate("2000.1.2. 3:4:5.6789", CULTURE_INFO.HU), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
});

it('formatDateLocal', () => {
	expect(formatDateLocal(new Date(2000, 0, 2, 3, 4, 5, 678))).toBe("01/02/2000");
});

it('formatDateTimeLocal.hourMinute', () => {
	expect(formatDateTimeLocal(new Date(2000, 0, 2, 3, 4, 5, 678))).toBe("01/02/2000 03:04");
});

it('formatDateTimeLocal.hourMinuteSecond', () => {
	expect(formatDateTimeLocal(new Date(2000, 0, 2, 3, 4, 5, 678), { seconds: true })).toBe("01/02/2000 03:04:05");
});

it('formatDateTimeLocal.hourMinuteSecondMillisecond', () => {
	expect(formatDateTimeLocal(new Date(2000, 0, 2, 3, 4, 5, 678), { milliseconds: true })).toBe("01/02/2000 03:04:05.678");
});

it('formatDate.cultureInfo', () => {
	expect(formatDate(new Date(2000, 0, 2, 3, 4, 5, 678), CULTURE_INFO.HU)).toBe("2000.01.02.");
});

it('formatDateTime.cultureInfo.hourMinute', () => {
	expect(formatDateTime(new Date(2000, 0, 2, 3, 4, 5, 678), CULTURE_INFO.HU)).toBe("2000.01.02. 03:04");
});

it('formatDateTime.cultureInfo.hourMinuteSecond', () => {
	expect(formatDateTime(new Date(2000, 0, 2, 3, 4, 5, 678), CULTURE_INFO.HU, { seconds: true })).toBe("2000.01.02. 03:04:05");
});

it('formatDateTime.cultureInfo.hourMinuteSecondMillisecond', () => {
	expect(formatDateTime(new Date(2000, 0, 2, 3, 4, 5, 678), CULTURE_INFO.HU, { milliseconds: true })).toBe("2000.01.02. 03:04:05.678");
});

it('tryParseDate.allCultureInfo.date', () => {
	const format = CULTURE_INFO.ALL;

	expect(sameDates(tryParseDate("1/2/2000", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000-01-02", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000-1-2", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000.1.2", format), new Date(2000, 0, 2))).toBe(true);
});

it('tryParseDate.allCultureInfo.dateTime', () => {
	const format = CULTURE_INFO.ALL;

	expect(sameDates(tryParseDate("1/2/2000 3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000-01-02T03:04:05.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000-1-2T3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000.1.2 3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
});

it('tryParseDate.allDateFormats.date', () => {
	const format = CULTURE_INFO.DATE_FORMATS.ALL;

	expect(sameDates(tryParseDate("1/2/2000", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000-01-02", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000-1-2", format), new Date(2000, 0, 2))).toBe(true);
	expect(sameDates(tryParseDate("2000.1.2", format), new Date(2000, 0, 2))).toBe(true);
});

it('tryParseDate.allDateFormats.dateTime', () => {
	const format = CULTURE_INFO.DATE_FORMATS.ALL;

	expect(sameDates(tryParseDate("1/2/2000 3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000-01-02T03:04:05.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000-1-2T3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
	expect(sameDates(tryParseDate("2000.1.2 3:4:5.6789", format), new Date(2000, 0, 2, 3, 4, 5, 678))).toBe(true);
});
