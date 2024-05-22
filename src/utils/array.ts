import { compareValues, sameValues } from "./value";
import { ArrayIterationNode, CompareReturn, Nullable, ValueCompareOptions, ValueOrArray, ValueOrCallbackWithArgs, ValueType } from "./types";
import { getResolvedArray, isArray, isEmpty, isFunction } from "./common";
import { REACT_SIMPLE_UTIL } from "data";
import { compareNumbers } from "./number";

export const range = (start: number, count: number) => {
	return Object.keys([...new Array(count)]).map(t => start + parseInt(t));
};

export const rangeFromTo = (start: number, finish: number) => {
	return finish >= start ? range(start, finish - start + 1) : [];
};

export const createArray = <T>(length: number, defaultValue?: ValueOrCallbackWithArgs<number, T>, indexBase?: number) => {
	let result = new Array<T>(length);

	if (!isEmpty(defaultValue)) {
		if (isFunction(defaultValue)) {
			for (let i = 0, j = indexBase || 0; i < length; i++, j++) {
				result[i] = defaultValue(j) as T;
			}
		}
		else {
			result = result.fill(defaultValue as T);
		}
	}

	return result;
};

// the default separator is ", "
export const joinNonEmptyValues = <T>(items: Nullable<T>[], separator = ", ") => {
	return items.filter(t => !isEmpty(t)).join(separator);
};

export const concatNonEmptyValues = <T>(items: Nullable<T>[], separator?: ValueOrArray<T>) => {
	const result: T[] = [];

	for (const item of items) {
		if (!isEmpty(item)) {
			if (result.length && separator) {
				if (isArray(separator)) {
					result.push(...separator);
				} else {
					result.push(separator);
				}
			}

			result.push(item);
		}
	}

	return result;
};

export const getNonEmptyValues = <T>(array: Nullable<T>[]) => {
	return array.filter(t => !isEmpty(t)).map(t => t!);
};

export const mapNonEmptyValues = <In, Out>(array: Nullable<In>[], map: (value: In) => Out) => {
	return array.filter(t => !isEmpty(t)).map(t => map(t!));
};

// Finds the first occurence where getValue() returns non-undefined and returns the value.
export function findNonEmptyValue<Item, Value>(arr: Item[], getValue: (item: Item) => Value): Value | undefined {
	for (const item of arr) {
		const value = getValue(item);

		if (!isEmpty(value)) {
			return value;
		}
	}

	return undefined;
}

// Will replace the [from, to) range. Returns a new array, does not change the parameter array.
export const arrayReplaceFromTo = <T>(arr: T[], from: number, to: number, value: T[]) => {
	return [
		...arr.slice(0, Math.max(from, 0)),
		...value,
		...arr.slice(Math.min(to, arr.length))
	];
};

// Will replace the [start, start + length) range. Returns a new array, does not change the parameter array.
export const arrayReplaceAt = <T>(arr: T[], start: number, length: number, value: T[]) => {
	return arrayReplaceFromTo(arr, start, start + length, value);
};

// Returns a new array, does not change the parameter array.
export const arrayInsertAt = <T>(arr: T[], index: number, insert: T[]) => {
	return (
		index <= 0 ? [...insert, ...arr] :
			index >= arr.length - 1 ? [...arr, ...insert] :
				[
					...arr.slice(0, index),
					...insert,
					...arr.slice(index)
				]
	);
};

// Will remove the [from, to) range. Returns a new array, does not change the parameter array.
export const arrayRemoveFromTo = <T>(arr: T[], from: number, to: number) => {
	return [
		...arr.slice(0, Math.max(from, 0)),
		...arr.slice(Math.min(to, arr.length))
	];
};

// Will remove the [start, start + length) range. Returns a new array, does not change the parameter array.
export const arrayRemoveAt = <T>(arr: T[], start: number, length: number = 1) => {
	return arrayRemoveFromTo(arr, start, start + length);
};

// the shorter array is considered to preceed the longer array.
// for array with same length compareValues() will be used.
function compareArrays_default<T>(arr1: T[], arr2: T[], options: ValueCompareOptions<T> = {}): CompareReturn {
	let result = compareNumbers(arr1.length, arr2.length);
	const compare = options.compareValues || compareValues;

	if (result) {
		return result;
	}

	for (let i = 0; i < arr1.length; i++) {
		result = compare!(arr1[i], arr2[i], options);

		if (result) {
			return result;
		}
	}

	return 0;
}

REACT_SIMPLE_UTIL.DI.array.compareArrays = compareArrays_default;
	
// the shorter array is considered to preceed the longer array.
// for array with same length compareValues() will be used.
// for dependency injection set REACT_SIMPLE_UTIL.DI.array.compareArrays
export function compareArrays<T>(arr1: T[], arr2: T[], options: ValueCompareOptions<T> = {}): CompareReturn {
	return REACT_SIMPLE_UTIL.DI.array.compareArrays(arr1, arr2, options, compareArrays_default);
}

// the shorter array is considered to preceed the longer array.
// for array with same length compareValues() will be used.
function sameArrays_default<T>(arr1: T[], arr2: T[], options: ValueCompareOptions<T, boolean> = {}): boolean {
	return compareArrays(arr1, arr2, options && {
		...options,
		// we check for equality, if it's less or greater that does not matter
		compareValues: options.compareValues ? (t1, t2) => (options.compareValues!(t1, t2, options) ? 0 : 1) : undefined
	}) === 0;
}

REACT_SIMPLE_UTIL.DI.array.sameArrays = sameArrays_default;

// the shorter array is considered to preceed the longer array.
// for array with same length compareValues() will be used.
// for dependency injection set REACT_SIMPLE_UTIL.DI.array.sameArrays
export function sameArrays<T>(arr1: T[], arr2: T[], options: ValueCompareOptions<T, boolean> = {}): boolean {
	return REACT_SIMPLE_UTIL.DI.array.sameArrays(arr1, arr2, options, sameArrays_default);
}

// returns distinct items, keeps order of first occurence (uses compareValues(), performs shallow comparation only)
export function getDistinct<T>(
	arr: T[],
	options: ValueCompareOptions<T, boolean> = {}
): T[] {
	const result: T[] = [];

	if (!options.compareValues && !options.ignoreCase && !options.trim) {
		// faster
		const added = new Set<T>();

		for (const item of arr) {
			if (!added.has(item)) {
				result.push(item);
				added.add(item);
			}
		}
	}
	else {
		// slower
		const compare = options.compareValues || sameValues;

		for (const item of arr) {
			if (!result.some(t => compare(t, item, options))) {
				result.push(item);
			}
		}
	}

	return result;
}

// returns distinct values, keeps order of first occurence
export function getDistinctValues<Item, Value>(
	arr: Item[],
	getValue: (item: Item) => Value,
	options: ValueCompareOptions<Value, boolean> = {}
): Value[] {
	const result: Value[] = [];

	if (!options.compareValues && !options.ignoreCase && !options.trim) {
		// faster
		const added = new Set<Value>();

		for (const item of arr) {
			const value = getValue(item);

			if (!added.has(value)) {
				result.push(value);
				added.add(value);
			}
		}
	} else {
		// slower
		const compare = options.compareValues || sameValues;

		for (const item of arr) {
			const value = getValue(item);

			if (!result.some(t => compare(t, value, options))) {
				result.push(value);
			}
		}
	}

	return result;
}

// returns items having distinct values, keeps order of first occurence
export function getDistinctBy<Item, Value>(
	arr: Item[],
	getValue: (item: Item) => Value,
	options: ValueCompareOptions<Value, boolean> = {}
): Item[] {
	const result: Item[] = [];

	if (!options.compareValues && !options.ignoreCase && !options.trim) {
		// faster
		const added = new Set<Value>();

		for (const item of arr) {
			const value = getValue(item);

			if (!added.has(value)) {
				result.push(item);
				added.add(value);
			}
		}
	}
	else {
		// slower
		const compare = options.compareValues || sameValues;
		const addedValues: Value[] = [];

		for (const item of arr) {
			const value = getValue(item);

			if (!addedValues.some(t => compare(t, value, options))) {
				result.push(item);
				addedValues.push(value);
			}
		}
	}

	return result;
}

export function sortArray<Value extends ValueType>(
	array: Value[],
	options: ValueCompareOptions<Value> & {
		reverse?: boolean;
	} = {}
): Value[] {
	const compare = options.compareValues || compareValues;
	const result = [...array]; // clone

	if (options.reverse) {
		result.sort((t1, t2) => compare(t2, t1, options));
	} else {
		result.sort((t1, t2) => compare(t1, t2, options));
	}

	return result;
}

export function sortArrayBy<Item, Value extends ValueType>(
	array: Item[],
	sortBy: (item: Item) => Value,
	options: ValueCompareOptions<Value> & {
		reverse?: boolean;
	} = {}
): Item[] {
	const compare = options.compareValues || compareValues;
	const result = [...array]; // clone

	if (options.reverse) {
		result.sort((t1, t2) => compare(sortBy(t2), sortBy(t1), options));
	} else {
		result.sort((t1, t2) => compare(sortBy(t1), sortBy(t2), options));
	}

	return result;
}

export const recursiveIteration = <Item>(
	rootNodes: Item | Item[],
	getChildren: (node: ArrayIterationNode<Item>) => Nullable<ValueOrArray<Item>>,
	callback: (node: ArrayIterationNode<Item>) => void,
	depthFirst = false // by deafult it's breadth-first
) => {
	let globalIndex = 0;

	const root = getResolvedArray(rootNodes);

	const queue: ArrayIterationNode<Item>[] = (depthFirst ? root.reverse() : root).map((item, index) => ({
		item,
		level: 0,
		indexInParent: index,
		indexOnLevel: index,
		globalIndex: globalIndex++
	}));

	const indexOnLevelByLevel: { [level: number]: number } = {};

	while (queue.length) {
		const args = depthFirst ? queue.pop()! : queue.shift()!;
		callback(args);

		const children = getResolvedArray(getChildren(args));

		if (children.length) {
			const level = args.level + 1;
			const indexOnLevel = indexOnLevelByLevel[level] || 0;
			indexOnLevelByLevel[level] = indexOnLevel + children.length;

			queue.push(...(depthFirst ? children.reverse() : children).map((item, index) => ({
				item,
				level,
				indexInParent: index,
				indexOnLevel: indexOnLevel + index,
				globalIndex: globalIndex++
			})));
		}
	}
};

export function findMapped<In, Out>(
	arr: In[],
	map: (item: In) => Out,
	predicate: (item: Out) => boolean
): Out | undefined {
	for (const item of arr) {
		const value = map(item);

		if (predicate(value)) {
			return value;
		}
	}

	return undefined;
}

export const forEachReverse = <T>(arr: T[], callback: (item: T, index: number) => void) => {
	for (let i = arr.length - 1; i >= 0; i--) {
		callback(arr[i], i);
	}
};

export const coalesce = <T>(...values: T[]) => {
	return values.find(t => !isEmpty(t));
};
