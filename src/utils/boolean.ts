import { REACT_SIMPLE_UTIL } from "data";
import { CompareReturn, Nullable, ValueOrCallback } from "./types";
import { getResolvedCallbackValue, isString, resolveEmpty } from "./typing";
import { BooleanFormat, CultureInfo } from "./cultureInfo";

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

export const getResolvedBooleanFormat = (format: Nullable<Partial<BooleanFormat> | { cultureInfo: CultureInfo }>) => {
	return (
		!format ? REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat :
			(format as { cultureInfo: CultureInfo }).cultureInfo ? (format as { cultureInfo: CultureInfo }).cultureInfo.booleanFormat :
				{ ...REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat, ...format as Partial<BooleanFormat>}
	);
};

// understands true, 1, yes, y, on, checked, enabled in different casing, string/number/boolean as TRUE
// see REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT_CULTURE.booleanFormat
export function tryParseBoolean(
	value: unknown,
	format?: Partial<Pick<BooleanFormat, "true_synonyms">> | { cultureInfo: CultureInfo }
): boolean | undefined {
	return (
		!value ? false :
			value === 1 || value === true ? true :
				isString(value) ? getResolvedBooleanFormat(format).true_synonyms.includes(value.trim().toLowerCase()) :
					undefined
	);
}

export const formatBoolean = (
	value: boolean,
	format?: Partial<Pick<BooleanFormat, "true_format" | "false_format">> | { cultureInfo: CultureInfo }
) => {
	return value
		? getResolvedBooleanFormat(format).true_format
		: getResolvedBooleanFormat(format).false_format;
};
