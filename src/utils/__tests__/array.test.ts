import {
	arrayInsertAt, arrayRemoveAt, arrayRemoveFromTo, arrayReplaceAt, arrayReplaceFromTo, compareArrays, concatNonEmptyValues, createArray,
	getDistinct, getDistinctBy, getDistinctValues, getNonEmptyValues, getResolvedArray, joinNonEmptyValues, mapNonEmptyValues,
	range, rangeFromTo, sameArrays, sameObjects, compareValues, sortArray, sortArrayBy, recursiveIteration
} from "utils";

const ARR = range(1, 9);

it('range', () => {
	expect(sameArrays(
		range(-10, 6),
		[-10, -9, -8, -7, -6, -5]
	)).toBe(true);
});

it('rangeFromTo', () => {
	expect(sameArrays(
		rangeFromTo(-10, -5),
		[-10, -9, -8, -7, -6, -5]
	)).toBe(true);
});

it('createArray.const', () => {
	expect(sameArrays(
		createArray(3, 0),
		[0, 0, 0]
	)).toBe(true);
});

it('createArray.function', () => {
	expect(sameArrays(
		createArray(5, t => t * t),
		[0, 1, 4, 9, 16]
	)).toBe(true);
});

it('createArray.function.indexbase', () => {
	expect(sameArrays(
		createArray(5, t => t * t, 3),
		[9, 16, 25, 36, 49]
	)).toBe(true);
});

it('getResolvedArray.array', () => {
	expect(sameArrays(getResolvedArray(ARR), ARR)).toBe(true);
});

it('getResolvedArray.scalar', () => {
	expect(sameArrays(getResolvedArray("test"), ["test"])).toBe(true);
});

it('arrayReplaceFromTo', () => {
	expect(sameArrays(
		arrayReplaceFromTo(ARR, 3, 6, [0, 0, 0]),
		[1, 2, 3, 0, 0, 0, 7, 8, 9]
	)).toBe(true);
});

it('arrayReplaceAt', () => {
	expect(sameArrays(
		arrayReplaceAt(ARR, 3, 3, [0, 0, 0]),
		[1, 2, 3, 0, 0, 0, 7, 8, 9]
	)).toBe(true);
});

it('arrayRemoveFromTo', () => {
	expect(sameArrays(
		arrayRemoveFromTo(ARR, 3, 6),
		[1, 2, 3, 7, 8, 9]
	)).toBe(true);
});

it('arrayRemoveAt', () => {
	expect(sameArrays(
		arrayRemoveAt(ARR, 3, 3),
		[1, 2, 3, 7, 8, 9]
	)).toBe(true);
});

it('arrayInsertAt', () => {
	expect(sameArrays(
		arrayInsertAt(ARR, 3, [0, 0, 0]),
		[1, 2, 3, 0, 0, 0, 4, 5, 6, 7, 8, 9]
	)).toBe(true);
});

it('joinNonEmptyValues.default', () => {
	expect(joinNonEmptyValues(["a", "b", "", "c", null, "d", undefined])).toBe("a, b, c, d");
});

it('joinNonEmptyValues.customseparator', () => {
	expect(joinNonEmptyValues(["a", "b", "", "c", null, "d", undefined], "_")).toBe("a_b_c_d");
});

it('joinNonEmptyValues.noseparator', () => {
	expect(joinNonEmptyValues(["a", "b", "", "c", null, "d", undefined], "")).toBe("abcd");
});

it('concatNonEmptyValues.noseparator', () => {
	expect(sameArrays(
		concatNonEmptyValues(["a", "b", "", "c", null, "d", undefined]),
		["a", "b", "c", "d"]
	)).toBe(true);
});

it('concatNonEmptyValues.customseparator.scalar', () => {
	expect(sameArrays(
		concatNonEmptyValues(["a", "b", "", "c", null, "d", undefined], "x"),
		["a", "x", "b", "x", "c", "x", "d"]
	)).toBe(true);
});

it('concatNonEmptyValues.customseparator.array', () => {
	expect(sameArrays(
		concatNonEmptyValues(["a", "b", "", "c", null, "d", undefined], ["x", "y"]),
		["a", "x", "y", "b", "x", "y", "c", "x", "y", "d"]
	)).toBe(true);
});

it('getNonEmptyValues', () => {
	expect(sameArrays(
		getNonEmptyValues(["a", "b", "", "c", null, "d", undefined]),
		["a", "b", "c", "d"]
	)).toBe(true);
});

it('mapNonEmptyValues', () => {
	expect(sameArrays(
		mapNonEmptyValues(["a", "b", "", "c", null, "d", undefined], t => `(${t})`),
		["(a)", "(b)", "(c)", "(d)"]
	)).toBe(true);
});

it('getDistinct', () => {
	expect(sameArrays(
		getDistinct([1, 2, 1, 1, 3, 2, 1]),
		[1, 2, 3]
	)).toBe(true);
});

it('getDistinctValues', () => {
	expect(sameArrays(
		getDistinctValues([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 1 }, { a: 3 }, { a: 2 }, { a: 1 }], t => t.a),
		[1, 2, 3]
	)).toBe(true);
});

it('getDistinctBy', () => {
	expect(sameObjects(
		getDistinctBy([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 1 }, { a: 3 }, { a: 2 }, { a: 1 }], t => t.a),
		[{ a: 1 }, { a: 2 }, { a: 3 }]
	)).toBe(true);
});

it('compareArrays.less', () => {
	expect(compareArrays([10, 20, 30], [10, 20, 35])).toBe(-1);
});

it('compareArrays.greater', () => {
	expect(compareArrays([10, 20, 30], [10, 15, 35])).toBe(1);
});

it('compareArrays.equals', () => {
	expect(compareArrays([10, 20, 30], [10, 20, 30])).toBe(0);
});

it('compareArrays.customcompare.equals', () => {
	expect(compareArrays(
		[10, 20, 30],
		[1, 2, 3],
		{
			compareValues: (t1, t2) => compareValues(t1, t2 * 10)
		}
	)).toBe(0);
});

it('compareArrays.string.less', () => {
	expect(compareArrays(
		["A", "b", "c"],
		["a ", " B", "d"],
		{
			trim: true,
			ignoreCase: true
		}
	)).toBe(-1);
});

it('compareArrays.string.greater', () => {
	expect(compareArrays(
		["A", "d", "c"],
		["a ", " B", "d"],
		{
			trim: true,
			ignoreCase: true
		}
	)).toBe(1);
});

it('compareArrays.string.equals', () => {
	expect(compareArrays(
		["a", "b", "c"],
		["a ", " b", "c"],
		{
			trim: true,
			ignoreCase: true
		}
	)).toBe(0);
});

it('sameArrays.equals', () => {
	expect(sameArrays([10, 20, 30], [10, 20, 30])).toBe(true);
});

it('sameArrays.customcompare', () => {
	expect(sameArrays(
		[10, 20, 30],
		[1, 2, 3],
		{
			compareValues: (t1, t2) => t1 === t2 * 10
		}
	)).toBe(true);
});

it('sameArrays.string.equals', () => {
	expect(sameArrays(
		["A", "b", "c"],
		["a ", " B", "c "],
		{
			trim: true,
			ignoreCase: true
		})).toBe(true);
});

it('sortArray.asc', () => {
	expect(sameArrays(sortArray([5, 2, 1, 4, 3]), [1, 2, 3, 4, 5])).toBe(true);
});

it('sortArray.desc', () => {
	expect(sameArrays(sortArray([5, 2, 1, 4, 3], { reverse: true }), [5, 4, 3, 2, 1])).toBe(true);
});

it('sortArrayBy.asc', () => {
	expect(sameObjects(
		sortArrayBy([{ a: 5 }, { a: 2 }, { a: 1 }, { a: 4 }, { a: 3 }], t => t.a),
		[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
	)).toBe(true);
});

it('sortArrayBy.desc', () => {
	expect(sameObjects(
		sortArrayBy([{ a: 5 }, { a: 2 }, { a: 1 }, { a: 4 }, { a: 3 }], t => t.a, { reverse: true }),
		[{ a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }]
	)).toBe(true);
});

it('sortArray.string', () => {
	expect(sameArrays(sortArray(["C ", " a ", " b"]), [" a ", " b", "C "], { ignoreCase: true, trim: true })).toBe(true);
});

it('recursiveIteration.brethFirst', () => {
	const arr = [
		{ value: 1 },
		{ value: 2 },
		{
			value: 3,
			children: [
				{ value: 5 },
				{
					value: 6,
					children: [
						{ value: 9 },
						{ value: 10 }
					]
				},
				{
					value: 7,
					children: []
				}
			]
		},
		{
			value: 4,
			children: { value: 8 }
		}
	];

	const result: number[] = [];
	recursiveIteration(arr, t => t.item.children, t => result.push(t.item.value));
	expect(sameArrays(result, range(1, 10))).toBe(true);
});

it('recursiveIteration.depthFirst', () => {
	const arr = [
		{ value: 1 },
		{ value: 2 },
		{
			value: 3,
			children: [
				{ value: 4 },
				{
					value: 5,
					children: [
						{ value: 6 },
						{ value: 7 }
					]
				},
				{
					value: 8,
					children: []
				}
			]
		},
		{
			value: 9,
			children: { value: 10 }
		}
	];

	const result: number[] = [];
	recursiveIteration(arr, t => t.item.children, t => result.push(t.item.value), true);
	expect(sameArrays(result, range(1, 10))).toBe(true);
});
