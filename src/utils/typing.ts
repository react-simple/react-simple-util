import { Nullable, ValueType, ValueOrCallback, ValueOrCallbackWithArgs } from "./types";

export function getResolvedCallbackValue<Value>(valueOrFn: ValueOrCallback<Value>): Value {
	return isFunction(valueOrFn) ? valueOrFn() : valueOrFn;
}

export function getResolvedCallbackValueWithArgs<Value, Args>(valueOrFn: ValueOrCallbackWithArgs<Value, Args>, args: Args): Value {
	return (isFunction(valueOrFn) ? valueOrFn(args) : valueOrFn) as Value;
}

// Does not consider falsy values empty (zero, empty string)
export function isEmpty(value: unknown): value is undefined | null | '' {
	return value === undefined || value === null || value === '';
}

export function isUndefinedOrNull(value: unknown): value is undefined | null {
	return value === undefined || value === null;
}

export function resolveEmpty<Value, EmptyValue>(value: Nullable<Value>, valueIfEmpty: ValueOrCallback<EmptyValue>): Value | EmptyValue {
	return isEmpty(value) ? getResolvedCallbackValue(valueIfEmpty) : value;
}

export function resolveUndefinedOrNull<Value, EmptyValue>(value: Nullable<Value>, valueIfEmpty: ValueOrCallback<EmptyValue>
): Value | EmptyValue {
	return isUndefinedOrNull(value) ? getResolvedCallbackValue(valueIfEmpty) : value;
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

export const isEmptyObject = (obj: unknown) => {
	return !obj || !Object.keys(obj).length;
};

export function isFile(value: unknown): value is File {
	return !!(
		(value as File).name &&
		(value as File).size &&
		(value as File).type
	);
}
