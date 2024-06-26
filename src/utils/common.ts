import { Nullable, ValueType, ValueOrCallback, ValueOrCallbackWithArgs, ValueOrArray } from "./types";

// Does not consider falsy values empty (zero, empty string). Considers NaN empty.
export function isEmpty(value: unknown): value is undefined | null | '' {
	return value === undefined || value === null || value === '' || (isNumber(value) && isNaN(value));
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
	return value === undefined || value === null;
}

export function resolveEmpty<Value, EmptyValue>(value: Nullable<Value>, valueIfEmpty: ValueOrCallback<EmptyValue>): Value | EmptyValue {
	return isEmpty(value) ? getResolvedCallbackValue(valueIfEmpty) : value;
}

export function resolveUndefinedOrNull<Value, EmptyValue>(value: Nullable<Value>, valueIfEmpty: ValueOrCallback<EmptyValue>
): Value | EmptyValue {
	return isNullOrUndefined(value) ? getResolvedCallbackValue(valueIfEmpty) : value;
}

export function isString(obj: unknown): obj is string {
	return typeof obj === 'string' || obj instanceof String;
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

export function isDate(value: unknown): value is Date {
	return !!(value && (value as Date).getTime && (value as Date).getDate);
}

export function isArray(obj: unknown): obj is any[] {
	return Array.isArray(obj);
}

export function isFunction(obj: any): obj is (...args: unknown[]) => unknown {
	return !!(obj && obj.constructor && obj.call && obj.apply)
}

// null and undefined are not considered primitive types, only string, boolean, number, Date.
export function isValueType(obj: unknown): obj is ValueType {
	return isString(obj) || isNumber(obj) || isBoolean(obj) || isDate(obj);
}

export function isObject(obj: unknown): obj is object {
	return !isValueType(obj) && !isArray(obj);
}

// Checks if the object has any keys set.
// If checkMemberValues is specified it also check the values of the members to be empty. By default it uses isEmpty().
export const isEmptyObject = (
	obj: unknown,
	checkMemberValues?: boolean,
	checkMemberValueIsEmpty?: (value: unknown) => boolean
) => {
	return (
		!obj ||
		!Object.keys(obj).length ||
		(checkMemberValues && Object.values(obj).every(checkMemberValueIsEmpty || isEmpty))
	);
};

export function isFile(value: unknown): value is File {
	return !!(
		(value as File)?.name &&
		(value as File)?.size &&
		(value as File)?.type
	);
}

export function getResolvedCallbackValue<Value>(valueOrFn: ValueOrCallback<Value>): Value {
	return isFunction(valueOrFn) ? valueOrFn() : valueOrFn;
}

export function getResolvedCallbackValueWithArgs<Args, Value>(
	valueOrFn: ValueOrCallbackWithArgs<Args, Value>,
	args: ValueOrCallback<Args>
): Value {
	return (isFunction(valueOrFn)
		? valueOrFn(getResolvedCallbackValue(args))
		: valueOrFn
	) as Value;
}

export function getResolvedArray<T>(valueOrArray: Nullable<T> | T[], splitValue?: (value: T) => T[]): T[] {
	return (
		!valueOrArray ? [] :
			isArray(valueOrArray) ? valueOrArray :
				splitValue ? splitValue(valueOrArray) :
					[valueOrArray]
	);
}

export const getResolvedObjectEntries = <Value>(entries: Record<string, Value> | [string, Value][]) => {
	return isArray(entries) ? entries : Object.entries(entries);
};
