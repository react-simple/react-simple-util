import {
	GetObjectChildMemberOptions, CompareReturn, ValueOrArray, ObjectCompareOptions, GetObjectChildMemberReturn, ObjectWithFullQualifiedName
} from "./types";
import { getResolvedArray, isArray, isEmpty, isNullOrUndefined, isValueType } from "./common";
import { compareValues, sameValues } from "./value";
import { arrayRemoveAt, getDistinct, sortArray } from "./array";
import { REACT_SIMPLE_UTIL } from "data";
import { stringAppend } from "./string";

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

function getObjectChildMemberRootObjAndPath(
	rootObj: object,
	fullQualifiedName: ValueOrArray<string>,
	options: GetObjectChildMemberOptions
): {
	obj: any;
	path?: string[];
} {
	if (!rootObj) {
		return { obj: rootObj };
	}

	const path = getResolvedArray(fullQualifiedName, t => t.split(options.pathSeparator || "."));

	if (!path.length) {
		return { obj: rootObj };
	}

	let obj: any = rootObj;

	// check root obj
	if (path[0].startsWith("/")) {
		obj = options.rootObj; // if undefined the caller will return undefined
		path[0] = path[0].substring(1);
	}
	// check named obj
	else if (path[0].startsWith("@")) {
		obj = options.getNamedObj?.(path[0].substring(1)); // if undefined the caller will return undefined
		path.splice(0, 1);
	}

	return { obj, path };
}

// Returns  child member value by resolving the specified path of member names. Create subobjects if children is not found.
// Understands array indexes, for example: memberName1.memberName2[index].memberName3
// Does not understand standalone indexes, for example: memberName1.memberName2.[index].memberName3
// Returns the last object which has the member to be set or get. (Returned 'name' is the last part of 'path'.)
function getObjectChildMember_default<ValueType = unknown, RootObj extends object = any>(
	rootObj: RootObj,
	fullQualifiedName: ValueOrArray<string>,
	options: GetObjectChildMemberOptions<ValueType> = {}
): GetObjectChildMemberReturn<ValueType, RootObj> {
	const prep = getObjectChildMemberRootObjAndPath(rootObj, fullQualifiedName, options);
	let obj = prep.obj;
	const path = prep.path;

	if (!obj || !path?.length) {
		return {
			rootObj,
			obj: rootObj,
			name: "",
			fullQualifiedName: "",
			parents: [],
			getValue: () => obj,
			setValue: () => false,
			deleteMember: () => false
		};
	}

	let parents: ObjectWithFullQualifiedName[] = [{ obj, name: "", fullQualifiedName: "" }];
	let parentFullQualifiedName = "";

	const length_m1 = path.length - 1;
	const getValue = options.getValue || ((t1, t2) => t1[t2]);
	const setValue = options.setValue || ((t1, t2, t3) => { t1[t2] = t3; return true; });
	const deleteMember = options.deleteMember || ((t1, t2) => { delete t1[t2]; return true; });

	// skip the last item
	path.forEach((memberName, memberNameIndex) => {
		const i = memberName.endsWith("]") ? memberName.lastIndexOf("[") : -1;

		if (memberNameIndex < length_m1) {
			// iterate children with path[0..length - 2] values
			let child: any;

			if (i < 0) {
				// name only
				child = getValue(obj, memberName, options);

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					setValue(obj, memberName, child, options); // create missing child
				}
			}
			else if (i === 0) {
				// [index] only
				const index = memberName.substring(1, memberName.length - 1);
				child = getValue(obj, index, options);

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					setValue(obj, index, child, options); // create missing item in array
				}
			}
			else {
				// name[index], name.[index]
				const name = memberName[i - 1] === "." ? memberName.substring(0, i - 1) : memberName.substring(0, i);
				const index = memberName.substring(i + 1, memberName.length - 1);

				let array = getValue(obj, name, options);

				if (array === undefined || array === null) {
					array = [];
					setValue(obj, name, array, options); // create missing child
				}

				child = getValue(array,index, options);

				if (child === undefined || child === null) {
					child = path[memberNameIndex + 1].startsWith("[") ? [] : {};
					setValue(array, index, child, options); // create missing item in array
				}
			}

			parentFullQualifiedName = stringAppend(parentFullQualifiedName, memberName, ".");

			obj = child;			

			parents.push({
				obj,
				name: memberName,
				fullQualifiedName: parentFullQualifiedName
			});
		}
	});

	const memberName = path[path.length - 1];
	const i = memberName.endsWith("]") ? memberName.lastIndexOf("[") : -1;
	
	// set value using path[length - 1]
	if (i < 0) {
		// name only
		return {
			rootObj,
			obj,
			name: memberName,
			fullQualifiedName: stringAppend(parentFullQualifiedName, memberName, "."),
			parents,
			getValue: () => getValue(obj, memberName, options),
			setValue: value => setValue(obj, memberName, value, options),
			deleteMember: () => deleteMember(obj, memberName, options)
		};
	}
	else if (i > 0) {
		// name[index], name.[index]
		const name = memberName[i - 1] === "." ? memberName.substring(0, i - 1) : memberName.substring(0, i);
		const index = memberName.substring(i + 1, memberName.length - 1);
		const indexNum = parseFloat(index);

		let array = getValue(obj, name, options);

		if (array === undefined || array === null) {
			array = [];
			setValue(obj, name, array, options);
		}

		return {
			rootObj,
			obj,
			name,
			fullQualifiedName: stringAppend(parentFullQualifiedName, name, "."),
			parents,
			arraySpec: {
				array,
				index,
				name: `[${index}]`,
				fullQualifiedName: stringAppend(parentFullQualifiedName, memberName, ".")
			},
			getValue: () => array[index],
			setValue: value => {
				array[index] = value;
				return true;
			},
			deleteMember: !isEmpty(indexNum)
				? () => {
					const newArray = arrayRemoveAt(array, indexNum);
					return setValue(obj, name, newArray, options);
				}
				: () => {
					delete array[index];
					return true;
				}
		};
	}
	else {
		// [index] only
		const index = memberName.substring(1, memberName.length - 1);
		const indexNum = parseFloat(index);
		const parentObj = parents[parents.length - 2]; // can be undefined
		const parentArray = parents[parents.length - 1];

		return {
			rootObj,
			obj: parentObj?.obj || obj,
			name: parentArray.name,
			fullQualifiedName: parentArray.fullQualifiedName,
			parents: parents.slice(0, -1),
			arraySpec: {
				array: obj,
				index,
				name: memberName,
				fullQualifiedName: stringAppend(parentFullQualifiedName, memberName, ".")
			},
			getValue: () => getValue(obj, index, options),
			setValue: value => setValue(obj, index, value, options),
			deleteMember: !isEmpty(indexNum)
				// set the new array instance in the parent obj
				? () => !!parentObj && setValue(parentObj.obj, parentArray.name, arrayRemoveAt(obj, indexNum), options)
				: () => deleteMember(obj, index, options)
		};
	}
}

REACT_SIMPLE_UTIL.DI.object.getObjectChildMember = getObjectChildMember_default;

// Returns  child member value by resolving the specified path of member names. Create subobjects if children is not found.
// Understands array indexes, for example: memberName1.memberName2[index].memberName3
// Does not understand standalone indexes, for example: memberName1.memberName2.[index].memberName3
// Returns the last object which has the member to be set or get. (Returned 'name' is the last part of 'path'.)
export function getObjectChildMember<ValueType = unknown, RootObj extends object = any>(
	rootObj: RootObj,
	fullQualifiedName: ValueOrArray<string>,
	options: GetObjectChildMemberOptions<ValueType> = {}
): GetObjectChildMemberReturn<ValueType, RootObj> {
	return REACT_SIMPLE_UTIL.DI.object.getObjectChildMember(rootObj, fullQualifiedName, options, getObjectChildMember_default);
}
