import { REACT_SIMPLE_UTIL } from "data";
import {
	arrayInsertAt, arrayRemoveAt, arrayRemoveFromTo, arrayReplaceAt, arrayReplaceFromTo, compareArrays, concatNonEmptyValues, createArray,
	getDistinct, getDistinctBy, getDistinctValues, getNonEmptyValues, getResolvedArray, joinNonEmptyValues, mapNonEmptyValues,
	range, rangeFromTo, sameArrays, sameObjects, compareValues, sortArray, sortArrayBy, recursiveIteration,
	callContext
} from "utils";

it('callContext', () => {
	const context = callContext(
		"test",
		REACT_SIMPLE_UTIL.DI.array.compareArrays,
		t => REACT_SIMPLE_UTIL.DI.array.compareArrays = t.data // finalize
	);

	try {
		REACT_SIMPLE_UTIL.DI.array.compareArrays = () => 0; // dummy return, return always true

		expect(sameArrays([10, 20, 30], [10, 20, 30])).toBe(true);
		expect(sameArrays([10, 20, 30], [1, 2, 3])).toBe(true);
		expect(sameArrays([10, 20, 30], [])).toBe(true);
	}
	finally {
		context.completed();
	}
});

it('callContext.run', () => {
	callContext(
		"test",
		REACT_SIMPLE_UTIL.DI.array.compareArrays,
		t => REACT_SIMPLE_UTIL.DI.array.compareArrays = t.data // finalize
	).run(() => {
		REACT_SIMPLE_UTIL.DI.array.compareArrays = () => 0; // dummy return, return always true
		
		expect(sameArrays([10, 20, 30], [10, 20, 30])).toBe(true);
		expect(sameArrays([10, 20, 30], [1, 2, 3])).toBe(true);
		expect(sameArrays([10, 20, 30], [])).toBe(true);
	});
});
