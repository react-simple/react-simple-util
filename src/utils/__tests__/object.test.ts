import {
	ObjectChildMemberAccessOptions, compareNumbers, compareObjects, deepCopyObject, deleteObjectChildMember, getObjectChildMemberValue,
	isNumber, mapObject, removeKeys, sameObjects, setObjectChildMemberValue
} from "utils";

const CHIILD_MEMBER_TESTOBJ = {
	a: {
		b: {
			c: 1,
			array: [11, 12]
		}
	}
};

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

// getObjectChildMemberValue

it('getObjectChildMemberValue.arrayPath', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, ["a", "b", "c"])).toBe(1);
});

it('getObjectChildMemberValue.stringPath', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.c")).toBe(1);
});

it('getObjectChildMemberValue.stringPath.nonExistent', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.c2")).toBeUndefined();
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b2.c")).toBeUndefined();
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a2.b.c")).toBeUndefined();
});

it('getObjectChildMemberValue.array.arrayPath[]', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, ["a", "b", "array[0]"])).toBe(11);
});

it('getObjectChildMemberValue.array.arrayPath.[]', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, ["a", "b", "array.[0]"])).toBe(11);
});

it('getObjectChildMemberValue.array.arrayPath-[]', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, ["a", "b", "array", "[0]"])).toBe(11);
});

it('getObjectChildMemberValue.array.stringPath[]', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.array[0]")).toBe(11);
});

it('getObjectChildMemberValue.array.stringPath.[]', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.array.[0]")).toBe(11);
});

it('getObjectChildMemberValue.array.stringPath', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.c")).toBe(1);
});

it('getObjectChildMemberValue.arrayPath', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, ["a", "b", "c"])).toBe(1);
});

it('getObjectChildMemberValue.stringPath', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.b.c")).toBe(1);
});

it('getObjectChildMemberValue.stringPath.customSeparator', () => {
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a/b/c", { pathSeparator: "/" })).toBe(1);
});

it('getObjectChildMemberValue.stringPath.rootObj', () => {
	const options = { rootObj: CHIILD_MEMBER_TESTOBJ };

	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ.a.b, "a.b.c", options)).toBe(undefined);
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ.a.b, "a./a.b.c", options)).toBe(undefined);
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ.a.b, "/a.b.c", options)).toBe(1);	
});

it('getObjectChildMemberValue.stringPath.namedObjs', () => {
	const options: ObjectChildMemberAccessOptions = {
		getNamedObj: name => name === "bbb" ? CHIILD_MEMBER_TESTOBJ.a.b : undefined
	};

	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "@b.c", options)).toBe(undefined);
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "@bb.c", options)).toBe(undefined);
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "a.@bbb.c", options)).toBe(undefined);
	expect(getObjectChildMemberValue(CHIILD_MEMBER_TESTOBJ, "@bbb.c", options)).toBe(1);
});

// setObjectChildMemberValue

it('setObjectChildMemberValue.arrayPath', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, ["a", "b", "c"], 2);

	expect(copy.a.b.c).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.stringPath', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, "a.b.c", 2);

	expect(copy.a.b.c).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.nonExistingMember.stringPath', () => {
	const obj: any = {};
	const leafObj = setObjectChildMemberValue(obj, "a.b.c", 2);

	expect(obj["a"]?.["b"]?.["c"]).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(obj["a"]?.["b"]);
});

it('setObjectChildMemberValue.array.arrayPath[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, ["a", "b", "array[0]"], 22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(leafObj?.["array"]?.[0]).toBe(22);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.array.arrayPath.[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, ["a", "b", "array.[0]"], 22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(leafObj["array"]?.[0]).toBe(22);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.array.arrayPath-[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, ["a", "b", "array", "[0]"], 22);
	
	expect(copy.a.b.array[0]).toBe(22);
	expect(leafObj?.[0]).toBe(22);
	expect(leafObj).toBe(copy.a.b.array);
});

it('setObjectChildMemberValue.array.stringPath[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, "a.b.array[0]", 22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(leafObj?.["array"]?.[0]).toBe(22);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.array.stringPath.[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, "a.b.array.[0]", 22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(leafObj?.[0]).toBe(22);
	expect(leafObj).toBe(copy.a.b.array);
});

it('setObjectChildMemberValue.nonExistingMember.array.stringPath', () => {
	const obj: any = {};
	const leafObj = setObjectChildMemberValue(obj, "a.b.array[0]", 2);

	expect(obj["a"]?.["b"]?.["array"]?.[0]).toBe(2);
	expect(leafObj?.["array"]?.[0]).toBe(2);
	expect(leafObj).toBe(obj["a"]?.["b"]);
});

it('setObjectChildMemberValue.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const leafObj = setObjectChildMemberValue(copy, "a/b/c", 2, { pathSeparator: "/" });

	expect(copy.a.b.c).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(copy.a.b);
});

it('setObjectChildMemberValue.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const leafObj = setObjectChildMemberValue(copy.a.b, "/a.b.c", 2, options);

	expect(copy.a.b.c).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(copy.a.b);
});

it('getObjectChildMemberValue.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const options: ObjectChildMemberAccessOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const leafObj = setObjectChildMemberValue(copy, "@bbb.c", 2, options);

	expect(copy.a.b.c).toBe(2);
	expect(leafObj?.["c"]).toBe(2);
	expect(leafObj).toBe(copy.a.b);
});

// deleteObjectChildMember

it('deleteObjectChildMember.stringPath', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const deleted = deleteObjectChildMember(copy, "a.b.c");

	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
	expect(deleted).toBe(1);
});

it('deleteObjectChildMember.array.stringPath[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const deleted = deleteObjectChildMember(copy, "a.b.array[0]");

	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
	expect(deleted).toBe(11);
});

it('deleteObjectChildMember.array.stringPath.[]', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const deleted = deleteObjectChildMember(copy, "a.b.array.[0]");

	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
	expect(deleted).toBe(11);
});

it('deleteObjectChildMember.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const deleted = deleteObjectChildMember(copy, "a/b/c", { pathSeparator: "/" });

	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
	expect(deleted).toBe(1);
});

it('deleteObjectChildMember.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const deleted = deleteObjectChildMember(copy.a.b, "/a.b.c", options);

	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
	expect(deleted).toBe(1);
});

it('deleteObjectChildMember.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHIILD_MEMBER_TESTOBJ);
	const options: ObjectChildMemberAccessOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const deleted = deleteObjectChildMember(copy, "@bbb.c", options);

	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
	expect(deleted).toBe(1);
});
