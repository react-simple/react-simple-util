import { compareBooleans, formatBoolean, resolveBoolean, tryParseBoolean } from "utils";
import { REACT_SIMPLE_UTIL } from "data";

const { CULTURE_INFO } = REACT_SIMPLE_UTIL;

it('compareBooleans.less', () => {
	expect(compareBooleans(false, true)).toBe(-1);
});

it('compareBooleans.greater', () => {
	expect(compareBooleans(true, false)).toBe(1);
});

it('compareBooleans.equals', () => {
	expect(compareBooleans(true, true)).toBe(0);
});

it('resolveBoolean.true', () => {
	expect(resolveBoolean(true, 1, 2, 3)).toBe(1);
});

it('resolveBoolean.false', () => {
	expect(resolveBoolean(false, 1, 2, 3)).toBe(2);
});

it('resolveBoolean.empty.1', () => {
	expect(resolveBoolean(undefined, 1, 2)).toBe(2);
});

it('resolveBoolean.empty.2', () => {
	expect(resolveBoolean(undefined, 1, 2, 3)).toBe(3);
});

it('tryParseBoolean.true', () => {
	expect(tryParseBoolean("true")).toBe(true);
});

it('tryParseBoolean.false', () => {
	expect(tryParseBoolean("false")).toBe(false);
});

it('tryParseBoolean.1', () => {
	expect(tryParseBoolean(1)).toBe(true);
});

it('tryParseBoolean.0', () => {
	expect(tryParseBoolean(0)).toBe(false);
});

it('tryParseBoolean.yes', () => {
	expect(tryParseBoolean("yes")).toBe(true);
});

it('tryParseBoolean.no', () => {
	expect(tryParseBoolean("no")).toBe(false);
});

it('tryParseBoolean.cultureInfo.true', () => {
	expect(tryParseBoolean("igen", { cultureInfo: CULTURE_INFO.HU })).toBe(true);
});

it('tryParseBoolean.cultureInfo.false', () => {
	expect(tryParseBoolean("nem", { cultureInfo: CULTURE_INFO.HU })).toBe(false);
});

it('formatBoolean.true', () => {
	expect(formatBoolean(true)).toBe("True");
});

it('formatBoolean.false', () => {
	expect(formatBoolean(false)).toBe("False");
});

it('formatBoolean.customFormat.true', () => {
	expect(formatBoolean(true, { true_format: "x", false_format: "-" })).toBe("x");
});

it('formatBoolean.customFormat.false', () => {
	expect(formatBoolean(false, { true_format: "x", false_format: "-" })).toBe("-");
});

it('formatBoolean.cultureInfo.true', () => {
	expect(formatBoolean(true, { cultureInfo: CULTURE_INFO.HU })).toBe("Igen");
});

it('formatBoolean.cultureInfo.false', () => {
	expect(formatBoolean(false, { cultureInfo: CULTURE_INFO.HU })).toBe("Nem");
});
