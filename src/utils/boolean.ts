import { CompareReturn, Nullable,  ValueOrCallback } from "./types";
import { getResolvedCallbackValue, resolveEmpty } from "./common";

// 'true' is considered to succeed 'false'
export function compareBooleans(value1: boolean, value2: boolean): CompareReturn {
	return value1 === value2 ? 0 : value1 ? 1 : -1;
}

export function resolveBoolean<Result>(
	value: Nullable<boolean>,
	trueValue: ValueOrCallback<Result>,
	falseValue: ValueOrCallback<Result>,
	emptyValue?: ValueOrCallback<Result>
): Result {
	return getResolvedCallbackValue(
		value === true ? trueValue :
			value === false ? falseValue :
				resolveEmpty(emptyValue, falseValue)
	);
}
