import {
	GetObjectChildMemberOptions, compareNumbers, compareObjects, deepCopyObject, getObjectChildMember, isNumber, mapObject,
	removeKeys, sameObjects
} from "utils";

const CHILD_MEMBER_TESTOBJ = {
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

// getObjectChildValue

it('getObjectChildValue.arrayPath', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "c"]);

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("c");
	expect(fullQualifiedName).toBe("a.b.c");
	expect(parents.length).toBe(3);	
	expect(arraySpec).toBeUndefined();
	expect(getValue()).toBe(1);
});

it('getObjectChildValue.stringPath', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.c");

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("c");
	expect(fullQualifiedName).toBe("a.b.c");
	expect(parents.length).toBe(3);
	expect(arraySpec).toBeUndefined();
	expect(getValue()).toBe(1);
});

it('getObjectChildValue.stringPath.nonExistent', () => {
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.c2").getValue()).toBeUndefined();
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b2.c").getValue()).toBeUndefined();
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a2.b.c").getValue()).toBeUndefined();
});

it('getObjectChildValue.array.arrayPath[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array[0]"]);
	
	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue()).toBe(11);	
});

it('getObjectChildValue.array.arrayPath.[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array.[0]"]);

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue()).toBe(11);
});

it('getObjectChildValue.array.arrayPath/[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array", "[0]"]);

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue()).toBe(11);
});

it('getObjectChildValue.array.stringPath[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.array[0]");

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue()).toBe(11);
});

it('getObjectChildValue.array.stringPath.[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.array.[0]");

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue()).toBe(11);
});

it('getObjectChildValue.stringPath.customSeparator', () => {
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a/b/c", { pathSeparator: "/" }).getValue()).toBe(1);
});

it('getObjectChildValue.stringPath.rootObj', () => {
	const options = { rootObj: CHILD_MEMBER_TESTOBJ };

	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "a.b.c", options).getValue()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "a./a.b.c", options).getValue()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "/a.b.c", options).getValue()).toBe(1);	
});

it('getObjectChildValue.stringPath.namedObjs', () => {
	const options: GetObjectChildMemberOptions = {
		getNamedObj: name => name === "bbb" ? CHILD_MEMBER_TESTOBJ.a.b : undefined
	};

	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@b.c", options).getValue()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@bb.c", options).getValue()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.@bbb.c", options).getValue()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@bbb.c", options).getValue()).toBe(1);
});

it('getObjectChildValue.custom.getMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	expect(getObjectChildMember(data, "a.b.c", {
		getValue: (parent, name) => parent[`${name}_`]
	}).getValue()).toBe(1);
});

// setObjectChildValue

it('setObjectChildValue.arrayPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);	
	const { obj, setValue } = getObjectChildMember(copy, ["a", "b", "c"]);
	setValue(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('setObjectChildValue.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, setValue } = getObjectChildMember(copy, "a.b.c");
	setValue(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('setObjectChildValue.nonExistingMember.stringPath', () => {
	const data: any = {};
	const { obj, setValue } = getObjectChildMember(data, "a.b.c");
	setValue(2);

	expect(data.a?.b?.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(data.a.b);
});

it('setObjectChildValue.array.arrayPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, ["a", "b", "array[0]"]);
	setValue(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);	
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.arrayPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue} = getObjectChildMember(copy, ["a", "b", "array.[0]"]);
	setValue(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.arrayPath/[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, ["a", "b", "array", "[0]"]);
	setValue(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, "a.b.array[0]");
	setValue(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj,arraySpec, setValue } = getObjectChildMember(copy, "a.b.array.[0]");
	setValue(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.nonExistingMember.array.stringPath', () => {
	const data: any = {};
	const { obj, setValue } = getObjectChildMember(data, "a.b.array[0]");
	setValue(22);

	expect(data?.a?.b?.array?.[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(data.a?.b);
});

it('setObjectChildValue.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, setValue } = getObjectChildMember(copy, "a/b/c", { pathSeparator: "/" });
	setValue(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('setObjectChildValue.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const { obj, setValue } = getObjectChildMember(copy.a.b, "/a.b.c", options);
	setValue(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildValue.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildMemberOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const { obj, setValue } = getObjectChildMember(copy, "@bbb.c", options);
	setValue(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('setObjectChildValue.custom.setMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const { setValue } = getObjectChildMember(data, "a.b.c", {
		getValue: (parent, name) => parent[`${name}_`],
		setValue: (parent, name, value) => { parent[`${name}_`] = value; return true; }
	});
	setValue(2);

	expect(data.a_.b_.c_).toBe(2);
});

// deleteObjectChildMember

it('deleteObjectChildMember.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const success = getObjectChildMember(copy, "a.b.c").deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const success = getObjectChildMember(copy, "a.b.array[0]").deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('deleteObjectChildMember.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);

	const success = getObjectChildMember(copy, "a.b.array.[0]").deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('deleteObjectChildMember.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const success = getObjectChildMember(copy, "a/b/c", { pathSeparator: "/" }).deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const success = getObjectChildMember(copy, "/a.b.c", options).deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildMemberOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const success = getObjectChildMember(copy, "@bbb.c", options).deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMemberValue.custom.deleteMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const success = getObjectChildMember(data, "a.b.c", {
		getValue: (parent, name) => parent[`${name}_`],
		deleteMember: (parent, name) => { delete parent[`${name}_`]; return true; }
	}).deleteMember();

	expect(success).toBe(true);
	expect(data.a_.b_.c_).toBeUndefined();
	expect(data.a_.b_).toBeDefined();
});
