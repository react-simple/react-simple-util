import {
	GetObjectChildValueOptions, deepCopyObject, deleteObjectChildMember, getObjectChildMember, getObjectChildValue, setObjectChildValue
	
 } from "utils";

const CHILD_MEMBER_TESTOBJ = {
	a: {
		b: {
			c: 1,
			array: [11, 12]
		}
	}
};

// getObjectChildMember.getValue()

it('getObjectChildMember.getValue.arrayPath', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "c"], false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("c");
	expect(fullQualifiedName).toBe("a.b.c");
	expect(parents?.length).toBe(3);	
	expect(arraySpec).toBeUndefined();
	expect(getValue?.()).toBe(1);
});

it('getObjectChildMember.getValue.stringPath', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.c", false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("c");
	expect(fullQualifiedName).toBe("a.b.c");
	expect(parents?.length).toBe(3);
	expect(arraySpec).toBeUndefined();
	expect(getValue?.()).toBe(1);
});

it('getObjectChildMember.getValue.stringPath.nonExistent', () => {
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.c2", false)?.getValue?.()).toBeUndefined();
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b2.c", false)?.getValue?.()).toBeUndefined();
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a2.b.c", false)?.getValue?.()).toBeUndefined();
});

it('getObjectChildMember.getValue.array.arrayPath[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array[0]"], false) || {};
	
	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents?.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue?.()).toBe(11);	
});

it('getObjectChildValue.array.arrayPath.[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array.[0]"], false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents?.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue?.()).toBe(11);
});

it('getObjectChildMember.getValue.array.arrayPath/[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, ["a", "b", "array", "[0]"], false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents?.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue?.()).toBe(11);
});

it('getObjectChildMember.getValue.array.stringPath[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.array[0]", false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents?.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue?.()).toBe(11);
});

it('getObjectChildMember.getValue.array.stringPath.[0]', () => {
	const { obj, name, fullQualifiedName, parents, arraySpec, getValue } = getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.b.array.[0]", false) || {};

	expect(obj).toBe(CHILD_MEMBER_TESTOBJ.a.b);
	expect(name).toBe("array");
	expect(fullQualifiedName).toBe("a.b.array");
	expect(parents?.length).toBe(3);
	expect(arraySpec?.array).toBe(CHILD_MEMBER_TESTOBJ.a.b.array);
	expect(arraySpec?.index).toBe("0");
	expect(getValue?.()).toBe(11);
});

it('getObjectChildValue.stringPath.customSeparator', () => {
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a/b/c", false, { pathSeparator: "/" })?.getValue?.()).toBe(1);
});

it('getObjectChildMember.getValue.stringPath.rootObj', () => {
	const options = { rootObj: CHILD_MEMBER_TESTOBJ };

	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "a.b.c", false, options)?.getValue?.()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "a./a.b.c", false, options)?.getValue?.()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ.a.b, "/a.b.c", false, options)?.getValue?.()).toBe(1);	
});

it('getObjectChildMember.getValue.stringPath.namedObjs', () => {
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? CHILD_MEMBER_TESTOBJ.a.b : undefined
	};

	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@b.c", false, options)?.getValue?.()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@bb.c", false, options)?.getValue?.()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "a.@bbb.c", false, options)?.getValue?.()).toBe(undefined);
	expect(getObjectChildMember(CHILD_MEMBER_TESTOBJ, "@bbb.c", false, options)?.getValue?.()).toBe(1);
});

it('getObjectChildMember.getValue.custom.getMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	expect(getObjectChildMember(data, "a.b.c", false, {
		getValue: (parent, name) => parent[`${name}_`]
	})?.getValue?.()).toBe(1);
});

// getObjectChildValue

it('getObjectChildValue.arrayPath', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, ["a", "b", "c"]).value).toBe(1);
});

it('getObjectChildValue.stringPath', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.b.c").value).toBe(1);
});

it('getObjectChildValue.stringPath.nonExistent', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.b.c2").value).toBeUndefined();
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.b2.c").value).toBeUndefined();
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a2.b.c").value).toBeUndefined();
});

it('getObjectChildValue.array.arrayPath[0]', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, ["a", "b", "array[0]"]).value).toBe(11);
});

it('getObjectChildValue.array.arrayPath.[0]', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, ["a", "b", "array.[0]"]).value).toBe(11);
});

it('getObjectChildValue.array.arrayPath/[0]', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, ["a", "b", "array", "[0]"]).value).toBe(11);
});

it('getObjectChildValue.array.stringPath[0]', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.b.array[0]").value).toBe(11);
});

it('getObjectChildValue.array.stringPath.[0]', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.b.array.[0]").value).toBe(11);
});

it('getObjectChildValue.stringPath.customSeparator', () => {
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a/b/c", { pathSeparator: "/" }).value).toBe(1);
});

it('getObjectChildValue.stringPath.rootObj', () => {
	const options = { rootObj: CHILD_MEMBER_TESTOBJ };

	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ.a.b, "a.b.c", options).value).toBe(undefined);
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ.a.b, "a./a.b.c", options).value).toBe(undefined);
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ.a.b, "/a.b.c", options).value).toBe(1);
});

it('getObjectChildValue.stringPath.namedObjs', () => {
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? CHILD_MEMBER_TESTOBJ.a.b : undefined
	};

	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "@b.c", options).value).toBe(undefined);
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "@bb.c", options).value).toBe(undefined);
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "a.@bbb.c", options).value).toBe(undefined);
	expect(getObjectChildValue(CHILD_MEMBER_TESTOBJ, "@bbb.c", options).value).toBe(1);
});

it('getObjectChildValue.custom.getMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	expect(getObjectChildValue(data, "a.b.c", {
		getValue: (parent, name) => parent[`${name}_`]
	}).value).toBe(1);
});

// getObjectChildMember.setValue()

it('getObjectChildMember.setValue.arrayPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);	
	const { obj, setValue } = getObjectChildMember(copy, ["a", "b", "c"], true) || {};
	setValue?.(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildMember.setValue.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, setValue } = getObjectChildMember(copy, "a.b.c", true) || {};
	setValue?.(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildMember.setValue.nonExistingMember.stringPath', () => {
	const data: any = {};
	const { obj, setValue } = getObjectChildMember(data, "a.b.c", true) || {};
	setValue?.(2);

	expect(data.a?.b?.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(data.a.b);
});

it('getObjectChildMember.setValue.array.arrayPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, ["a", "b", "array[0]"], true) || {};
	setValue?.(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);	
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('getObjectChildMember.setValue.array.arrayPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, ["a", "b", "array.[0]"], true) || {};
	setValue?.(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('getObjectChildMember.setValue.array.arrayPath/[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, ["a", "b", "array", "[0]"], true) || {};
	setValue?.(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('getObjectChildMember.setValue.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, "a.b.array[0]", true) || {};
	setValue?.(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('getObjectChildMember.setValue.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, arraySpec, setValue } = getObjectChildMember(copy, "a.b.array.[0]", true) || {};
	setValue?.(22);

	expect(copy.a.b.array[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(copy.a.b);
	expect(arraySpec?.array?.[0]).toBe(22);
});

it('getObjectChildMember.setValue.nonExistingMember.array.stringPath', () => {
	const data: any = {};
	const { obj, setValue } = getObjectChildMember(data, "a.b.array[0]", true) || {};
	setValue?.(22);

	expect(data?.a?.b?.array?.[0]).toBe(22);
	expect(obj?.array?.[0]).toBe(22);
	expect(obj).toBe(data.a?.b);
});

it('getObjectChildMember.setValue.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { obj, setValue } = getObjectChildMember(copy, "a/b/c", true, { pathSeparator: "/" }) || {};
	setValue?.(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildMember.setValue.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const { obj, setValue } = getObjectChildMember(copy.a.b, "/a.b.c", true, options) || {};
	setValue?.(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildMember.setValue.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const { obj, setValue } = getObjectChildMember(copy, "@bbb.c", true, options) || {};
	setValue?.(2);

	expect(copy.a.b.c).toBe(2);
	expect(obj?.c).toBe(2);
	expect(obj).toBe(copy.a.b);
});

it('getObjectChildMember.setValue.custom.setMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const { setValue } = getObjectChildMember(data, "a.b.c", true, {
		getValue: (parent, name) => parent[`${name}_`],
		setValue: (parent, name, value) => { parent[`${name}_`] = value; return true; }
	}) || {};
	setValue?.(2);

	expect(data.a_.b_.c_).toBe(2);
});

// setObjectChildValue

it('setObjectChildValue.arrayPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, ["a", "b", "c"], 2);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(copy.a.b);
});

it('setObjectChildValue.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, "a.b.c", 2);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(copy.a.b);
});

it('setObjectChildValue.nonExistingMember.stringPath', () => {
	const data: any = {};
	const { accessor, success } = setObjectChildValue(data, "a.b.c", 2);

	expect(success).toBe(true);
	expect(data.a?.b?.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(data.a.b);
});

it('setObjectChildValue.array.arrayPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, ["a", "b", "array[0]"], 22);

	expect(success).toBe(true);
	expect(copy.a.b.array[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(copy.a.b);
	expect(accessor.arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.arrayPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, ["a", "b", "array.[0]"], 22);

	expect(success).toBe(true);
	expect(copy.a.b.array[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(copy.a.b);
	expect(accessor.arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.arrayPath/[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, ["a", "b", "array", "[0]"], 22);

	expect(success).toBe(true);
	expect(copy.a.b.array[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(copy.a.b);
	expect(accessor.arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, "a.b.array[0]", 22);

	expect(success).toBe(true);
	expect(copy.a.b.array[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(copy.a.b);
	expect(accessor.arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, "a.b.array.[0]", 22);

	expect(success).toBe(true);
	expect(copy.a.b.array[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(copy.a.b);
	expect(accessor.arraySpec?.array?.[0]).toBe(22);
});

it('setObjectChildValue.nonExistingMember.array.stringPath', () => {
	const data: any = {};
	const { accessor, success } = setObjectChildValue(data, "a.b.array[0]", 22);

	expect(success).toBe(true);
	expect(data?.a?.b?.array?.[0]).toBe(22);
	expect(accessor.obj?.array?.[0]).toBe(22);
	expect(accessor.obj).toBe(data.a?.b);
});

it('setObjectChildValue.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { accessor, success } = setObjectChildValue(copy, "a/b/c", 2, { pathSeparator: "/" });

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(copy.a.b);
});

it('setObjectChildValue.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const { accessor, success } = setObjectChildValue(copy.a.b, "/a.b.c", 2, options);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(copy.a.b);
});

it('setObjectChildValue.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const { accessor, success } = setObjectChildValue(copy, "@bbb.c", 2, options);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(2);
	expect(accessor.obj?.c).toBe(2);
	expect(accessor.obj).toBe(copy.a.b);
});

it('setObjectChildValue.custom.setMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const { accessor, success } = setObjectChildValue(data, "a.b.c", 2, {
		getValue: (parent, name) => parent[`${name}_`],
		setValue: (parent, name, value) => { parent[`${name}_`] = value; return true; }
	});

	expect(success).toBe(true);
	expect(data.a_.b_.c_).toBe(2);
});

// getObjectChildMember.deleteMember()

it('getObjectChildMember.deleteMember.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const accessor = getObjectChildMember(copy, "a.b.c", false);
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('getObjectChildMember.deleteMember.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const accessor = getObjectChildMember(copy, "a.b.array[0]", false);
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('getObjectChildMember.deleteMember.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const accessor = getObjectChildMember(copy, "a.b.array.[0]", false);
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('getObjectChildMember.deleteMember.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const accessor = getObjectChildMember(copy, "a/b/c", false, { pathSeparator: "/" });
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('getObjectChildMember.deleteMember.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const accessor = getObjectChildMember(copy, "/a.b.c", false, options);
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('getObjectChildMember.deleteMember.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const accessor = getObjectChildMember(copy, "@bbb.c", false, options);
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('getObjectChildMember.deleteMember.custom.deleteMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const accessor = getObjectChildMember(data, "a.b.c", false, {
		getValue: (parent, name) => parent[`${name}_`],
		deleteMember: (parent, name) => { delete parent[`${name}_`]; return true; }
	});
	const success = accessor?.deleteMember();

	expect(success).toBe(true);
	expect(data.a_.b_.c_).toBeUndefined();
	expect(data.a_.b_).toBeDefined();
});

// deleteObjectChildMember

it('deleteObjectChildMember.stringPath', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { success } = deleteObjectChildMember(copy, "a.b.c");

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.array.stringPath[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { success } = deleteObjectChildMember(copy, "a.b.array[0]");

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('deleteObjectChildMember.array.stringPath.[0]', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { success } = deleteObjectChildMember(copy, "a.b.array.[0]");

	expect(success).toBe(true);
	expect(copy.a.b.c).toBe(1);
	expect(copy.a.b.array?.length).toBe(1);
	expect(copy.a.b.array[0]).toBe(12);
});

it('deleteObjectChildMember.stringPath.customSeparator', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const { success } = deleteObjectChildMember(copy, "a/b/c", { pathSeparator: "/" });

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.stringPath.rootObj', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options = { rootObj: copy };
	const { success } = deleteObjectChildMember(copy, "/a.b.c", options);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.stringPath.namedObjs', () => {
	const copy = deepCopyObject(CHILD_MEMBER_TESTOBJ);
	const options: GetObjectChildValueOptions = {
		getNamedObj: name => name === "bbb" ? copy.a.b : undefined
	};

	const { success } = deleteObjectChildMember(copy, "@bbb.c", options);

	expect(success).toBe(true);
	expect(copy.a.b.c).toBeUndefined();
	expect(copy.a.b).toBeDefined();
	expect(copy.a.b.array?.[0]).toBe(11);
});

it('deleteObjectChildMember.custom.deleteMemberValue', () => {
	const data = { a_: { b_: { c_: 1 } } };

	const { success } = deleteObjectChildMember(data, "a.b.c", {
		getValue: (parent, name) => parent[`${name}_`],
		deleteMember: (parent, name) => { delete parent[`${name}_`]; return true; }
	});

	expect(success).toBe(true);
	expect(data.a_.b_.c_).toBeUndefined();
	expect(data.a_.b_).toBeDefined();
});
