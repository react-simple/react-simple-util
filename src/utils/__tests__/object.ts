import { compareNumbers, compareObjects, deepCopyObject, isNumber, mapObject, removeKeys, sameObjects } from "utils";

// compareObjects

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

it('compareObjects.custom.compareValues', () => {
	expect(compareObjects(
		{ a: { b: 1 } },
		{ a: { b: 10 } },
		{
			compareValues: (t1, t2) => compareNumbers(t1 as number * 10, t2 as number)
		}
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

// sameObjects

it('sameObjects.equals', () => {
	expect(sameObjects(
		{ a: { b: 1 } },
		{ a: { b: 1 } }
	)).toBe(true);
});

it('sameObjects.custom.compareValues', () => {
	expect(sameObjects(
		{ a: { b: 1 } },
		{ a: { b: 10 } },
		{
			compareValues: (t1, t2) => t1 as number * 10 === t2 as number
		}
	)).toBe(true);
});

it('sameObjects.strings', () => {
	expect(sameObjects(
		{ a: { b: " a " } },
		{ a: { b: "A" } },
		{ ignoreCase: true, trim: true }
	)).toBe(true);
});

// other

it('removeKeys', () => {
	expect(sameObjects(
		removeKeys({ a: 1, b: 2, c: 3, d: undefined, e: undefined }, ["b", "d"]),
		{ a: 1, c: 3, e: undefined }
	)).toBe(true);
});

it('mapObject', () => {
	expect(mapObject({ a: 1 }, t => (t as number) * 10).a).toBe(10);
});

it('deepCopyObject', () => {
	const original = { a: { b: { c: 1 } } };
	const copy = deepCopyObject(original);

	expect(original.a.b.c).toBe(1);
	expect(copy.a.b.c).toBe(1);
	expect(copy).not.toBe(original);
});

it('deepCopyObject.transform', () => {
	const original = { a: { b: { c: 1 } } };
	const copy = deepCopyObject(original, t => isNumber(t) ? t * 10 : t);

	expect(original.a.b.c).toBe(1);
	expect(copy.a.b.c).toBe(10);
	expect(copy).not.toBe(original);
});
