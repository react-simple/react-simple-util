import { compareValues, sameDates, sameValues, tryParseValue, tryParseValueLocal } from "utils";

// string

it('compareValues.string.equals', () => {
	expect(compareValues(" a ", "A", { ignoreCase: true, trim: true })).toBe(0);
});

it('compareValues.string.less', () => {
	expect(compareValues(" a ", "B", { ignoreCase: true, trim: true })).toBe(-1);
});

it('compareValues.string.greater', () => {
	expect(compareValues(" ac ", "AB", { ignoreCase: true, trim: true })).toBe(1);
});

it('sameValues.string', () => {
	expect(sameValues(" ac ", "AC", { ignoreCase: true, trim: true })).toBe(true);
});

it('compareValues.string.undefined.less', () => {
	expect(compareValues(undefined, "A", { ignoreCase: true, trim: true })).toBe(-1);
});

// number

it('compareValues.number.equals', () => {
	expect(compareValues(1, 1)).toBe(0);
});

it('compareValues.number.less', () => {
	expect(compareValues(-1, 1)).toBe(-1);
});

it('compareValues.number.greater', () => {
	expect(compareValues(1, -1)).toBe(1);
});

it('sameValues.number', () => {
	expect(sameValues(1, 1)).toBe(true);
});

it('compareValues.number.undefined.less', () => {
	expect(compareValues(undefined, 1)).toBe(-1);
});

// date

it('compareValues.date.equals', () => {
	expect(compareValues(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(0);
});

it('compareValues.date.less', () => {
	expect(compareValues(new Date(1999, 1, 1), new Date(2000, 1, 1))).toBe(-1);
});

it('compareValues.date.greater', () => {
	expect(compareValues(new Date(2001, 1, 1), new Date(2000, 1, 1))).toBe(1);
});

it('sameValues.date', () => {
	expect(sameValues(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(true);
});

it('compareValues.date.undefined.less', () => {
	expect(compareValues(undefined, new Date(2000, 1, 1))).toBe(-1);
});

// iso date

it('compareValues.isodate.equals', () => {
	expect(compareValues("2000-01-01", "2000-01-01")).toBe(0);
});

it('compareValues.isodate.less', () => {
	expect(compareValues("1999-01-01", "2000-01-01")).toBe(-1);
});

it('compareValues.isodate.greater', () => {
	expect(compareValues("2001-01-01", "2000-01-01")).toBe(1);
});

it('sameValues.isodate', () => {
	expect(sameValues("2000-01-01", "2000-01-01")).toBe(true);
});

it('compareValues.isodate.undefined.less', () => {
	expect(compareValues(undefined, "2000-01-01")).toBe(-1);
});

// iso datetime

it('compareValues.isodatetime.equals', () => {
	expect(compareValues("2000-01-01T10:00:00", "2000-01-01T10:00:00")).toBe(0);
});

it('compareValues.isodatetime.less', () => {
	expect(compareValues("2000-01-01T09:00:00", "2000-01-01T10:00:00")).toBe(-1);
});

it('compareValues.isodatetime.greater', () => {
	expect(compareValues("2000-01-01T11:00:00", "2000-01-01T10:00:00")).toBe(1);
});

it('sameValues.isodatetime', () => {
	expect(sameValues("2000-01-01T10:00:00", "2000-01-01T10:00:00")).toBe(true);
});

it('compareValues.isodatetime.undefined.less', () => {
	expect(compareValues(undefined, "2000-01-01T10:00:00")).toBe(-1);
});

// boolean

it('compareValues.boolean.equals', () => {
	expect(compareValues(true, true)).toBe(0);
});

it('compareValues.boolean.less', () => {
	expect(compareValues(false, true)).toBe(-1);
});

it('compareValues.boolean.greater', () => {
	expect(compareValues(true, false)).toBe(1);
});

it('sameValues.boolean', () => {
	expect(sameValues(false, false)).toBe(true);
});

it('compareValues.boolean.undefined.less', () => {
	expect(compareValues(undefined, false)).toBe(-1);
});

it('tryParseValue.number', () => {
	expect(tryParseValueLocal(123.456)).toBe(123.456);
	expect(tryParseValueLocal("123.456")).toBe(123.456);
});

it('tryParseValue.boolean', () => {
	expect(tryParseValueLocal(true)).toBe(true);
	expect(tryParseValueLocal("true")).toBe(true);
	expect(tryParseValueLocal(1, { forcedType: "boolean" })).toBe(true); // by default 1 is understood as a number

	expect(tryParseValueLocal(false)).toBe(false);
	expect(tryParseValueLocal("false")).toBe(false);
	expect(tryParseValueLocal(0, { forcedType: "boolean" })).toBe(false);
});

it('tryParseValue.date', () => {
	const date = new Date(2000, 0, 2, 3, 4, 5, 6);
	expect(tryParseValueLocal(date)).toBe(date);
	expect(sameDates(tryParseValueLocal("1/2/2000 3:4:5.6") as Date, date)).toBe(true);
	expect(sameDates(tryParseValueLocal(date.getTime(), { forcedType: "date" }) as Date, date)).toBe(true); // by default it's understood as a number
});
