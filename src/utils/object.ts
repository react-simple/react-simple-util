import { CompareReturn, ObjectCompareOptions  } from "./types";
import { isArray, isEmpty, isNullOrUndefined, isValueType } from "./common";
import { compareValues, sameValues } from "./value";
import { getDistinct, sortArray } from "./array";
import { REACT_SIMPLE_UTIL } from "data";

// accepts of keyof Obj keys
export function removeKeys<Obj extends object>(
	obj: Obj,
	keys: (keyof Obj)[] | (([key, value]: [keyof Obj, unknown]) => boolean),
	onRemove?: ([key, value]: [keyof Obj, unknown]) => void
): Obj {
	const result: Obj = { ...obj }; // clone

	if (isArray(keys)) {
		for (const key of keys) {
			if (Object.hasOwn(obj, key)) {
				if (onRemove) {
					onRemove([key, result[key]]);
				}

				delete result[key];
			}
		}
	} else {
		for (const entry of Object.entries(obj)) {
			if (keys(entry as [keyof Obj, unknown])) {
				delete result[entry[0] as keyof Obj];
				onRemove?.(entry as [keyof Obj, unknown]);
			}
		}
	}

	return result;
}

// accepts any keys (string)
export function removeKeysUnsafe<Obj extends object>(
	obj: Obj,
	keys: string[] | (([key, value]: [string, unknown]) => boolean),
	onRemove?: ([key, value]: [string, unknown]) => void
): Obj {
	const result: Obj = { ...obj }; // clone

	if (isArray(keys)) {
		for (const key of keys) {
			if (Object.hasOwn(obj, key)) {
				if (onRemove) {
					onRemove([key, result[key as keyof Obj]]);
				}

				delete result[key as keyof Obj];
			}
		}
	} else {
		for (const entry of Object.entries(obj)) {
			if (keys(entry)) {
				delete result[entry[0] as keyof Obj];
				onRemove?.(entry);
			}
		}
	}

	return result;
}

// member names always compared case-sensitive. members are compared in alphabetical order (by name).
function compareObjects_default(obj1: any, obj2: any, options: ObjectCompareOptions = {}): CompareReturn {
	if (options.compareObjects) {
		return options.compareObjects(obj1, obj2, options);
	}
	else if (obj1 === obj2) {
		return 0;
	}
	else if (isNullOrUndefined(obj1)) {
		return isNullOrUndefined(obj2) ? 0 : -1;
	}
	else if (isNullOrUndefined(obj2)) {
		return 1;
	}
	else {
		if (isValueType(obj1) || isValueType(obj2)) {
			// compare values
			return (options.compareValues || compareValues)(obj1, obj2, options);
		}
		else {
			// compare objects
			// check all keys in alphabetical order for proper comparison (not the order of definition, but the order by name)
			const keys = sortArray(getDistinct([...Object.keys(obj1 as object), ...Object.keys(obj2 as object)]));
			const compareObj = options.compareObjects || compareObjects_default;

			for (const key of keys) {
				const result = compareObj(obj1[key], obj2[key], options);

				if (result) {
					return result;
				}
			}

			return 0;
		}
	}
}

REACT_SIMPLE_UTIL.DI.object.compareObjects = compareObjects_default;

// member names always compared case-sensitive. members are compared in alphabetical order (by name).
export function compareObjects(obj1: any, obj2: any, options: ObjectCompareOptions = {}): CompareReturn {
	return REACT_SIMPLE_UTIL.DI.object.compareObjects(obj1, obj2, options, compareObjects_default);
}

// member names always compared case-sensitive
function sameObjects_default(obj1: any, obj2: any, options: ObjectCompareOptions<boolean> = {}): boolean {
	if (obj1 === obj2) {
		return true;
	}
	else if (isNullOrUndefined(obj1)) {
		return isNullOrUndefined(obj2);
	}
	else if (isNullOrUndefined(obj2)) {
		return false;
	}
	else {
		if (isValueType(obj1) || isValueType(obj2)) {
			return (options.compareValues || sameValues)(obj1, obj2, options);
		}
		else {
			const compare = options.compareObjects || sameObjects_default;

			// check keys of obj1
			for (const [key, value1] of Object.entries(obj1 as object)) {
				const result = compare(value1, obj2[key], options);

				if (!result) {
					return result;
				}
			}

			// check keys of obj2 which obj1 does not have
			for (const [key, value2] of Object.entries(obj2 as object)) {
				if (!Object.hasOwn(obj1 as object, key) && !isEmpty(value2)) {
					// obj1 has no value for this key, but obj2 does (if obj1 had this key then we would have it compared in the previous loop)
					return false;
				}
			}

			return true;
		}
	}
}

REACT_SIMPLE_UTIL.DI.object.sameObjects = sameObjects_default;

// member names always compared case-sensitive
export function sameObjects(obj1: any, obj2: any, options: ObjectCompareOptions<boolean> = {}): boolean {
	return REACT_SIMPLE_UTIL.DI.object.sameObjects(obj1, obj2, options, sameObjects_default);
}

// Be careful to not change value type in transform(). Shallow map, not a deep map of all children. Use deepCopyObject() to deep copy/transform.
export function mapObject<T>(obj: T, map: (value: unknown, key: string | number) => unknown): T {
	if (!obj || isValueType(obj)) {
		return obj;
	}
	else if (isArray(obj)) {
		return obj.map(map) as T;
	}
	else {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			result[key] = map(value, key);
		}

		return result as T;
	}
}

// Be careful to not change value type in transform().
// Transform is called for all children not value types (leaves) only, but not for the root.
function deepCopyObject_default<Obj extends object>(
	obj: Obj,
	transformValue?: (value: unknown, key: string | number, obj: unknown) => unknown
): Obj {
	if (!obj || isValueType(obj)) {
		return obj;
	}
	else {
		transformValue ||= (value => value);

		if (isArray(obj)) {
			return obj.map((value, index) => transformValue!(
				!value || isValueType(value) ? value : deepCopyObject(value, transformValue),
				index, obj
			)) as Obj;
		}
		else {
			return mapObject(obj, (value, key) => transformValue!(
				!value || isValueType(value) ? value : deepCopyObject(value, transformValue),
				key,
				obj
			)) as Obj;
		}
	}
}

REACT_SIMPLE_UTIL.DI.object.deepCopyObject = deepCopyObject_default;

export function deepCopyObject<Obj extends object>(
	obj: Obj,
	transformValue?: (value: unknown, key: string | number, obj: unknown) => unknown
): Obj {
	return REACT_SIMPLE_UTIL.DI.object.deepCopyObject(obj, transformValue, deepCopyObject_default);
}
