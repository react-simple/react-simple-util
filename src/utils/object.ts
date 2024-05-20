import { ObjectChildMemberAccessOptions, CompareReturn, StringCompareOptions, ValueOrArray, ObjectCompareOptions } from "./types";
import { getResolvedArray, isArray, isEmpty, isNullOrUndefined, isValueType } from "./typing";
import { compareValues, sameValues } from "./value";
import { arrayRemoveAt, getDistinct, sortArray } from "./array";
import { tryParseFloatISO } from "./number";
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
function compareObjects_default(obj1: unknown, obj2: unknown, options?: ObjectCompareOptions): CompareReturn {
	if (options?.compareObjects) {
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
			return (options?.compareValues || compareValues)(obj1, obj2, options);
		}
		else {
			// compare objects
			// check all keys in alphabetical order for proper comparison (not the order of definition, but the order by name)
			const keys = sortArray(getDistinct([...Object.keys(obj1 as object), ...Object.keys(obj2 as object)]));
			const compareObj = options?.compareObjects || ((t1, t2, t3) => compareObjects_default(t1, t2, t3));

			for (const key of keys) {
				const result = compareObj((obj1 as any)[key], (obj2 as any)[key], options);

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
export function compareObjects(obj1: unknown, obj2: unknown, options?: ObjectCompareOptions): CompareReturn {
	return REACT_SIMPLE_UTIL.DI.object.compareObjects(obj1, obj2, options || {}, compareObjects_default);
}

// member names always compared case-sensitive
function sameObjects_default(obj1: unknown, obj2: unknown, options?: ObjectCompareOptions<boolean>): boolean {
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
			return (options?.compareValues || sameValues)(obj1, obj2, options);
		}
		else {
			const compare = options?.compareObjects || ((t1, t2, t3) => sameObjects_default(t1, t2, t3));

			// check keys of obj1
			for (const [key, value1] of Object.entries(obj1 as object)) {
				const result = compare(value1, (obj2 as any)[key], options);

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
export function sameObjects(obj1: unknown, obj2: unknown, options?: ObjectCompareOptions<boolean>): boolean {
	return REACT_SIMPLE_UTIL.DI.object.sameObjects(obj1, obj2, options || {}, sameObjects_default);
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
export function deepCopyObject<T>(
	obj: T,
	transform?: (value: unknown, key: string | number, obj: unknown) => unknown
): T {
	if (!obj || isValueType(obj)) {
		return obj;
	}
	else {
		transform ||= (value => value);

		if (isArray(obj)) {
			return obj.map((value, index) => transform!(
				!value || isValueType(value) ? value : deepCopyObject(value, transform),
				index, obj
			)) as T;
		}
		else {
			return mapObject(obj, (value, key) => transform!(
				!value || isValueType(value) ? value : deepCopyObject(value, transform),
				key,
				obj
			)) as T;
		}
	}
}

function getObjectChildMemberObjAndPath(
	currentObj: unknown,
	fullQualifiedName: ValueOrArray<string>,
	options?: ObjectChildMemberAccessOptions
): {
	obj: any;
	path?: string[];
} {
	if (!currentObj) {
		return { obj: currentObj };
	}

	const path = getResolvedArray(fullQualifiedName, t => t.split(options?.pathSeparator || "."));

	if (!path.length) {
		return { obj: currentObj };
	}

	let obj: any = currentObj;

	// check root obj
	if (path[0].startsWith("/")) {
		obj = options?.rootObj; // if undefined the caller will return undefined
		path[0] = path[0].substring(1);
	}
	// check named obj
	else if (path[0].startsWith("@")) {
		obj = options?.getNamedObj?.(path[0].substring(1)); // if undefined the caller will return undefined
		path.splice(0, 1);
	}

	return { obj, path };
}

// Gets child member value by resolving the specified path of member names. Returns undefined if children are not found.
// Understands array indexes, for example: memberName1.memberName2[index].memberName3
// Also understand standalone indexes, for example: memberName1.memberName2.[index].memberName3
export const getObjectChildMemberValue = (
	currentObj: unknown,
	fullQualifiedName: ValueOrArray<string>,
	options?: ObjectChildMemberAccessOptions
) => {
	const prep = getObjectChildMemberObjAndPath(currentObj, fullQualifiedName, options);
	let obj = prep.obj;
	const path = prep.path;

	if (!obj || !path) {
		return obj;
	}

	for (const memberName of path) {
		const i = memberName.endsWith("]") ? memberName.lastIndexOf("[") : -1;

		if (i < 0) {
			// name only
			obj = obj[memberName];
		}
		else if (i === 0) {
			// [index] only			
			obj = obj[memberName.substring(1, memberName.length - 1)];
		}
		else if (memberName[i - 1] === ".") {
			// name.[index]
			obj = obj[memberName.substring(0, i - 1)]?.[memberName.substring(i + 1, memberName.length - 1)];
		} else {
			// name[index]
			obj = obj[memberName.substring(0, i)]?.[memberName.substring(i + 1, memberName.length - 1)];
		}

		if (!obj) {
			return undefined;
		}
	}

	return obj as unknown;
};

// Sets child member value by resolving the specified path of member names. Create subobjects if children is not found.
// Understands array indexes, for example: memberName1.memberName2[index].memberName3
// Does not understand standalone indexes, for example: memberName1.memberName2.[index].memberName3
// Returns the last object which has its member set.
export const setObjectChildMemberValue = (
	currentObj: unknown,
	fullQualifiedName: ValueOrArray<string>,
	value: unknown,
	options?: ObjectChildMemberAccessOptions
) => {
	const prep = getObjectChildMemberObjAndPath(currentObj, fullQualifiedName, options);
	let obj = prep.obj;
	const path = prep.path;

	if (!obj || !path) {
		return obj;
	}

	const length_m1 = path.length - 1;

	path.forEach((memberName, memberNameIndex) => {
		const i = memberName.endsWith("]") ? memberName.lastIndexOf("[") : -1;

		if (memberNameIndex < length_m1) {
			// iterate children with path[0..length - 2] values
			let child: any;

			if (i < 0) {
				// name only
				child = obj[memberName];

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					obj[memberName] = child;
				}
			}
			else if (i === 0) {
				// [index] only
				const index = memberName.substring(1, memberName.length - 1);

				child = obj[index];

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					obj[index] = child;
				}
			}
			else {
				// name[index], name.[index]
				const name = memberName[i - 1] === "." ? memberName.substring(0, i - 1) : memberName.substring(0, i);
				const index = memberName.substring(i + 1, memberName.length - 1);

				let array = obj[name];

				if (array === undefined || array === null) {
					array = [];
					obj[name] = array;
				}

				child = array[index];

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					array[index] = child;
				}
			}

			obj = child;
		}
		else {
			// set value using path[length - 1] value
			if (i < 0) {
				// name only
				obj[memberName] = value;
			}
			else if (i > 0) {
				// name[index], name.[index]
				const name = memberName[i - 1] === "." ? memberName.substring(0, i - 1) : memberName.substring(0, i);
				const index = memberName.substring(i + 1, memberName.length - 1);

				let array = obj[name];

				if (array === undefined || array === null) {
					array = [];
					obj[name] = array;
				}

				array[index] = value;
			}
			else {
				// [index] only
				const index = memberName.substring(1, memberName.length - 1);
				obj[index] = value;
			}
		}
	});

	return obj;
};

// Sets child member value by resolving the specified path of member names. Create subobjects if children is not found.
// Understands array indexes, for example: memberName1.memberName2[index].memberName3
// Does not understand standalone indexes, for example: memberName1.memberName2.[index].memberName3
// Returns the last object which has its member set.
export const deleteObjectChildMember = (
	currentObj: unknown,
	fullQualifiedName: ValueOrArray<string>,
	options?: ObjectChildMemberAccessOptions
) => {
	const prep = getObjectChildMemberObjAndPath(currentObj, fullQualifiedName, options);
	let obj = prep.obj;
	const path = prep.path;

	if (!obj || !path) {
		return obj;
	}

	const length_m1 = path.length - 1;
	let parentObj: any;
	let parentKey: string;
	let result: unknown = undefined;

	path.forEach((memberName, memberNameIndex) => {
		const i = memberName.endsWith("]") ? memberName.lastIndexOf("[") : -1;

		if (memberNameIndex < length_m1) {
			// iterate children with path[0..length - 2] values
			if (i < 0) {
				// name only
				parentObj = obj;
				parentKey = memberName;
			}
			else if (i === 0) {
				// [index] only
				parentObj = obj;
				parentKey = memberName.substring(1, memberName.length - 1);
			}
			else {
				// name.[index]
				parentObj = memberName[i - 1] === "." ? obj[memberName.substring(0, i - 1)] : obj[memberName.substring(0, i)];
				parentKey = memberName.substring(i + 1, memberName.length - 1);
			}

			obj = parentObj?.[parentKey];

			if (obj === undefined || obj === null) {
				return undefined;
			}
		}
		else {
			// set value using path[length - 1] value
			if (i < 0) {
				// name only
				result = obj[memberName];
				delete obj[memberName];
			}
			else if (i > 0) {
				// name[index], name.[index]
				const name = memberName[i - 1] === "." ? memberName.substring(0, i - 1) : memberName.substring(0, i);
				let array = obj[name];

				if (obj === undefined || obj === null) {
					return undefined;
				}

				const index = memberName.substring(i + 1, memberName.length - 1);
				const indexNum = tryParseFloatISO(index);

				result = array[index];

				if (indexNum !== undefined) {
					array = arrayRemoveAt(array, indexNum);
					obj[name] = array;
				} else {
					delete array[index];
				}				
			}
			else {
				// [index] only
				const index = memberName.substring(1, memberName.length - 1);
				const indexNum = tryParseFloatISO(index);

				result = obj[index];

				if (indexNum !== undefined) {
					obj = arrayRemoveAt(obj, indexNum);

					if (parentObj) {
						parentObj[parentKey] = obj;
					}
				} else {
					delete obj[index];
				}
			}
		}
	});

	return result;
};
