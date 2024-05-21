import { CultureInfoBooleanFormat } from "./localization";
import { BOOLEAN_FORMATS } from "./localization/internal";
import { CompareReturn, Nullable, ValueOrArray, ValueOrCallback } from "./types";
import { getResolvedCallbackValue, isArray, isString, resolveEmpty } from "./common";
import { REACT_SIMPLE_UTIL } from "data";

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
function tryParseBoolean_default(
	value: unknown,
	formats: ValueOrArray<Pick<CultureInfoBooleanFormat, "true_synonyms">>
): boolean | undefined {
	if (value === false || value === 0) {
		return false;
	}
	else if (value === true || value === 1) {
		return true;
	}
	else if (!isString(value)) {
		return undefined;
	}
	else if (isArray(formats)) {
		const valueStr = value.trim().toLowerCase();
		return formats.some(t => t.true_synonyms.includes(valueStr));
	} else {
		return (formats || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat).true_synonyms.includes(value.trim().toLowerCase());
	}
}

REACT_SIMPLE_UTIL.DI.boolean.tryParseBoolean = tryParseBoolean_default;

// understands true, 1, yes, y, on, checked, enabled in different casing, string/number/boolean as TRUE
export function tryParseBoolean(
	value: unknown,
	formats: ValueOrArray<Pick<CultureInfoBooleanFormat, "true_synonyms">>
): boolean | undefined {
	return REACT_SIMPLE_UTIL.DI.boolean.tryParseBoolean(value, formats, tryParseBoolean_default);
}

export function tryParseBooleanISO(value: unknown): boolean | undefined {
	return tryParseBoolean(value, BOOLEAN_FORMATS.ISO);
}

export function tryParseBooleanLocal(value: unknown): boolean | undefined {
	return tryParseBoolean(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat);
}

export function tryParseBooleanLocalOrISO(value: unknown): boolean | undefined {
	return tryParseBoolean(value, [BOOLEAN_FORMATS.ISO, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat]);
}

function formatBoolean_default(value: boolean, format: Pick<CultureInfoBooleanFormat, "true_format" | "false_format">): string {
	return value
		? (format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat).true_format
		: (format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat).false_format;
}

REACT_SIMPLE_UTIL.DI.boolean.formatBoolean = formatBoolean_default;

export const formatBoolean = (value: boolean, format: Pick<CultureInfoBooleanFormat, "true_format" | "false_format">) => {
	return REACT_SIMPLE_UTIL.DI.boolean.formatBoolean(value, format,formatBoolean_default);
};

export const formatBooleanISO = (value: boolean) => {
	return formatBoolean(value, BOOLEAN_FORMATS.ISO);
};

export const formatBooleanLocal = (value: boolean) => {
	return formatBoolean(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.booleanFormat);
};
