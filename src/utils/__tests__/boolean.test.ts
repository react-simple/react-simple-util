import { CULTURE_INFO, compareBooleans, formatBoolean, formatBooleanLocal, resolveBoolean, tryParseBoolean, tryParseBooleanLocal } from "utils";

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
	expect(tryParseBooleanLocal("true")).toBe(true);
});

it('tryParseBoolean.false', () => {
	expect(tryParseBooleanLocal("false")).toBe(false);
});

it('tryParseBoolean.undefiend', () => {
	expect(tryParseBooleanLocal("xxx")).toBeUndefined();
});

it('tryParseBoolean.1', () => {
	expect(tryParseBooleanLocal(1)).toBe(true);
});

it('tryParseBoolean.0', () => {
	expect(tryParseBooleanLocal(0)).toBe(false);
});

it('tryParseBoolean.-1', () => {
	expect(tryParseBooleanLocal(-1)).toBeUndefined();
});

it('tryParseBoolean.2', () => {
	expect(tryParseBooleanLocal(-1)).toBeUndefined();
});

it('tryParseBoolean.yes', () => {
	expect(tryParseBooleanLocal("yes")).toBe(true);
});

it('tryParseBoolean.no', () => {
	expect(tryParseBooleanLocal("no")).toBe(false);
});

it('tryParseBoolean.cultureInfo.true', () => {
	expect(tryParseBoolean("igen", CULTURE_INFO.BOOLEAN_FORMATS.HU)).toBe(true);
});

it('tryParseBoolean.cultureInfo.false', () => {
	expect(tryParseBoolean("nem", CULTURE_INFO.BOOLEAN_FORMATS.HU)).toBe(false);
});

it('formatBoolean.true', () => {
	expect(formatBooleanLocal(true)).toBe("True");
});

it('formatBoolean.false', () => {
	expect(formatBooleanLocal(false)).toBe("False");
});

it('formatBoolean.customFormat.true', () => {
	expect(formatBoolean(true, { true_format: "x", false_format: "-" })).toBe("x");
});

it('formatBoolean.customFormat.false', () => {
	expect(formatBoolean(false, { true_format: "x", false_format: "-" })).toBe("-");
});

it('formatBoolean.cultureInfo.true', () => {
	expect(formatBoolean(true, CULTURE_INFO.BOOLEAN_FORMATS.HU)).toBe("Igen");
});

it('formatBoolean.cultureInfo.false', () => {
	expect(formatBoolean(false, CULTURE_INFO.BOOLEAN_FORMATS.HU)).toBe("Nem");
});
