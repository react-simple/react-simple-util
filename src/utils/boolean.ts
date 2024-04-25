import { CompareReturn, Nullable, ValueOrCallback } from "./types";
import { getResolvedCallbackValue, isString, resolveEmpty } from "./typing";
import { BooleanFormat, CultureInfoFormat, getResolvedCultureInfoFormat } from "./cultureInfo";

export const getResolvedBooleanFormat = (format: Nullable<CultureInfoFormat<BooleanFormat>>) => {
	return getResolvedCultureInfoFormat(format, t => t.booleanFormat);
};

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

// understands true, 1, yes, y, on, checked, enabled in different casing, string/number/boolean as TRUE
// see REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT_CULTURE.booleanFormat
export function tryParseBoolean(
	value: unknown,
	format?: CultureInfoFormat<Pick<BooleanFormat, "true_synonyms">>
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
	format?: CultureInfoFormat<Pick<BooleanFormat, "true_format" | "false_format">>
) => {
	return value
		? getResolvedBooleanFormat(format).true_format
		: getResolvedBooleanFormat(format).false_format;
};
