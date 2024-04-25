import { compareObjects, removeKeys, sameObjects } from "utils";

it('compareObjects.less', () => {
	expect(compareObjects(
		{ a: { b: 1 } },
		{ a: { b: 2 } }
	)).toBe(-1);
});

it('compareObjects.greater', () => {
	expect(compareObjects(
		{ a: { b: 3 } },
		{ a: { b: 2 } }
	)).toBe(1);
});

it('compareObjects.equals', () => {
	expect(compareObjects(
		{ a: { b: 1 } },
		{ a: { b: 1 } }
	)).toBe(0);
});

it('compareObjects.less.undefined', () => {
	// obj1 does not have value for member 'a' which is less than any value present in obj2; members are compared in alphatbetical order (by name)
	expect(compareObjects(
		{ x: { b: 1 } },
		{ x: { a: 1 } }
	)).toBe(-1);
});

it('compareObjects.greater.undefined', () => {
	// obj1 does not have value for member 'a' which is less than any value present in obj2; members are compared in alphatbetical order (by name)
	expect(compareObjects(
		{ x: { a: 1 } },
		{ x: { b: 1 } }
	)).toBe(1);
});

it('sameObjects.equals', () => {
	expect(sameObjects(
		{ a: { b: 1 } },
		{ a: { b: 1 } }
	)).toBe(true);
});

it('sameObjects.strings', () => {
	expect(sameObjects(
		{ a: { b: " a " } },
		{ a: { b: "A" } },
		{ ignoreCase: true, trim: true }
	)).toBe(true);
});

it('removeKeys', () => {
	expect(sameObjects(
		removeKeys({ a: 1, b: 2, c: 3, d: undefined, e: undefined }, ["b", "d"]),
		{ a: 1, c: 3, e: undefined }
	)).toBe(true);
});
