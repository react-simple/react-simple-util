import { compareBooleans, resolveBoolean } from "utils";

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
