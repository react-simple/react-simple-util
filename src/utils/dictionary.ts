import { compareObjects, sameObjects } from "./object";
import { CompareReturn, StringCompareOptions, ValueOrArray } from "./types";
import { getResolvedArray, isArray } from "./typing";

export function convertArrayToDictionary<Item, Value>(
	array: Item[],
	getEntry: (item: Item) => [string, Value]
): Record<string, Value> {
	const result: Record<string, Value> = {};

	for (const item of array) {
		const [key, value] = getEntry(item);
		result[key] = value;
	}

	return result;
}

export function convertArrayToDictionary2<Item, Value>(
	array: Item[],
	getEntry: (item: Item) => [string, string, Value]
): Record<string, Record<string, Value>> {
	const result: Record<string, Record<string, Value>> = {};

	for (const item of array) {
		const [key1, key2, value] = getEntry(item);
		let dict = result[key1];

		if (!dict) {
			dict = {};
			result[key1] = dict;
		}

		dict[key2] = value;
	}

	return result;
}

export function iterateDictionary<Value>(dict: Record<string, Value>, action: ([key, value]: [string, Value]) => void) {
	for (const entry of Object.entries(dict)) {
		action(entry);
	}
}

export function filterDictionary<Value>(
	dict: Record<string, Value>,
	predicate: ([key, value]: [string, Value]) => boolean
): Record<string, Value> {
	const result: Record<string, Value> = {};

	iterateDictionary(dict, entry => {
		if (predicate(entry)) {
			result[entry[0]] = entry[1];
		}
	});

	return result;
}

export function mapDictionaryValues<In, Out>(
	dict: Record<string, In>,
	map: (value: In, key: string) => Out
): Record<string, Out> {
	const result: Record<string, Out> = {};

	iterateDictionary(dict, ([key, value]) => {
		result[key] = map(value, key);
	});

	return result;
}

export function mapDictionaryEntries<In, Out>(
	dict: Record<string, In>,
	map: (entry: [string, In]) => [string, Out]
): Record<string, Out> {
	const result: Record<string, Out> = {};

	iterateDictionary(dict, entry => {
		const newEntry = map(entry);
		result[newEntry[0]] = newEntry[1];
	});

	return result;
}

export function copyDictionary<In, Out>(
	dict: Record<string, In>,
	clone: ([key, value]: [string, In]) => ValueOrArray<[string, Out]> | undefined // undefined items will be skipped
): Record<string, Out> {
	const result: Record<string, Out> = {};

	iterateDictionary(dict, entry => {
		const newEntry = clone(entry);

		if (newEntry) {
			if (isArray(newEntry)) {
				newEntry.forEach(entry2 => {
					result[(entry2 as [string, Out])[0]] = (entry2 as [string, Out])[1];
				});
			} else {
				result[newEntry[0]] = newEntry[1];
			}
		}
	});

	return result;
}

// member names always compared case-sensitive. members are compared in alphabetical order (by name).
export function compareDictionaries<Value>(
	dict1: Record<string, Value>,
	dict2: Record<string, Value>,
	options?: StringCompareOptions & {
		compare?: (value1: unknown, value2: unknown) => CompareReturn;
	}
): CompareReturn {
	return compareObjects(dict1, dict2, options);
}

// member names always compared case-sensitive
export function sameDictionaries(
	dict1: unknown,
	dict2: unknown,
	options?: StringCompareOptions & {
		compare?: (value1: unknown, value2: unknown) => boolean;
	}
): boolean {
	return sameObjects(dict1, dict2, options);
}

export function appendDictionary<Value>(
	target: Record<string, Value>,
	source: ValueOrArray<Record<string, Value>>,
	options?: {
		filter?: (value: Value, key: string) => boolean,
		mapValue?: (value: Value, key: string) => Value,
		mapEntry?: (entry: [string, Value]) => [string, Value]
	}
) {
	const { filter, mapEntry, mapValue } = options || {};

	for (const dict of getResolvedArray(source)) {
		for (const [key, value] of Object.entries(dict)) {
			if (!filter || filter(value, key)) {
				if (mapEntry) {
					const newEntry = mapEntry([key, value]);
					target[newEntry[0]] = newEntry[1];
				}
				else if (mapValue) {
					target[key] = mapValue(value, key);
				}
				else {
					target[key] = value;
				}
			}
		}
	}
}

export function mergeDictionaries<Value>(
	dicts: Record<string, Value>[],
	options?: {
		filter?: (value: Value, key: string) => boolean,
		mapValue?: (value: Value, key: string) => Value,
		mapEntry?: (entry: [string, Value]) => [string, Value]
	}
): Record<string, Value> {
	const result: Record<string, Value> = {};
	appendDictionary(result, dicts, options);
	return result;
}
