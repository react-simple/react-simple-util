import { CompareReturn, StringCompareOptions } from "./types";
import { isArray, isEmpty, isUndefinedOrNull, isValueType } from "./typing";
import { compareValues, sameValues } from "./value";
import { getDistinct, sortArray } from "./array";

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
export function compareObjects(
	obj1: unknown,
	obj2: unknown,
	options?: StringCompareOptions & {
		compare?: (value1: unknown, value2: unknown) => CompareReturn;
	}
): CompareReturn {
	if (obj1 === obj2) {
		return 0;
	}
	else if (isUndefinedOrNull(obj1)) {
		return isUndefinedOrNull(obj2) ? 0 : -1;
	}
	else if (isUndefinedOrNull(obj2)) {
		return 1;
	}
	else {
		const compare = options?.compare || ((t1, t2) => compareValues(t1, t2, options));

		if (isValueType(obj1) || isValueType(obj2)) {
			return compare(obj1, obj2);
		}
		else {
			// check all keys in alphabetical order for proper comparison (not the order of definition, but the order by name)
			const keys = sortArray(getDistinct([...Object.keys(obj1 as object), ...Object.keys(obj2 as object)]));

			for (const key of keys) {
				const result = compareObjects((obj1 as any)[key], (obj2 as any)[key], options);

				if (result) {
					return result;
				}
			}

			return 0;
		}
	}
}

// member names always compared case-sensitive
export function sameObjects(
	obj1: unknown,
	obj2: unknown,
	options?: StringCompareOptions & {
		compare?: (value1: unknown, value2: unknown) => boolean;
	}
): boolean {
	if (obj1 === obj2) {
		return true;
	}
	else if (isUndefinedOrNull(obj1)) {
		return isUndefinedOrNull(obj2);
	}
	else if (isUndefinedOrNull(obj2)) {
		return false;
	}
	else {
		const compare = options?.compare || ((t1, t2) => sameValues(t1, t2, options));

		if (isValueType(obj1) || isValueType(obj2)) {
			return compare(obj1, obj2);
		}
		else {
			// check keys of obj1
			for (const [key, value1] of Object.entries(obj1 as object)) {
				const result = sameObjects(value1, (obj2 as any)[key], options);

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
