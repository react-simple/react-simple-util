import { REACT_SIMPLE_UTIL } from "data";
import { compareBooleans, tryParseBoolean, tryParseBooleanLocalOrISO } from "./boolean";
import { compareDates, sameDates, tryParseDate, tryParseDateLocalOrISO } from "./date";
import { compareNumbers, tryParseFloat, tryParseFloatISO } from "./number";
import { compareStrings, getComparableString, sameStrings, stringEndsWith, stringIncludes, stringStartsWith } from "./string";
import {
	CompareReturn, EvaluateValueBinaryOperatorOptions, EvaluateValueUnaryOperatorOptions, Nullable, ValueBinaryOperator,
	ValueCompareOptions, ValueUnaryOperator
} from "./types";
import { isBoolean, isDate, isNumber, isNullOrUndefined, isEmpty } from "./common";

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
// understands DATE_FORMATS.ISO and REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat.
function compareValues_default<Value = unknown>(
	value1: Value,
	value2: Value,
	options: ValueCompareOptions<Value> = {}
): CompareReturn {
	if (options.compareValues) {
		return options.compareValues(value1, value2, options);
	}
	else if (value1 === value2) {
		return 0;
	}
	else if (isNullOrUndefined(value1)) {
		return isNullOrUndefined(value2) ? 0 : -1;
	}
	else if (isNullOrUndefined(value2)) {
		return 1;
	}
	else {
		// number
		if (isNumber(value1) || isNumber(value2)) {
			const num1 = options.cultureInfo?.numberFormat
				? tryParseFloat(value1, options.cultureInfo.numberFormat)
				: tryParseFloatISO(value1);

			const num2 = options.cultureInfo?.numberFormat
				? tryParseFloat(value2, options.cultureInfo.numberFormat)
				: tryParseFloatISO(value2);

			if (num1 !== undefined && num2 !== undefined) {
				return compareNumbers(num1, num2);
			}
		}

		// date
		if (isDate(value1) || isDate(value2)) {
			const date1 = options.cultureInfo?.dateFormat
				? tryParseDate(value1 as Date, options.cultureInfo.dateFormat)
				: tryParseDateLocalOrISO(value1 as Date);

			const date2 = options.cultureInfo?.dateFormat
				? tryParseDate(value2 as Date, options.cultureInfo.dateFormat)
				: tryParseDateLocalOrISO(value2 as Date);

			if (date1 !== undefined && date2 !== undefined) {
				return compareDates(date1, date2);
			}
		}

		// boolean
		if (isBoolean(value1) || isBoolean(value2)) {
			const bool1 = options.cultureInfo?.booleanFormat
				? tryParseBoolean(value1, options.cultureInfo.booleanFormat)
				: tryParseBooleanLocalOrISO(value1);

			const bool2 = options.cultureInfo?.booleanFormat
				? tryParseBoolean(value2, options.cultureInfo.booleanFormat)
				: tryParseBooleanLocalOrISO(value2);

			if (bool1 !== undefined && bool2 !== undefined) {
				return compareBooleans(bool1, bool2);
			}
		}

		// string
		return compareStrings(`${value1}`, `${value2}`, options);
	}
}

REACT_SIMPLE_UTIL.DI.value.compareValues = compareValues_default;

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
// understands DATE_FORMATS.ISO and REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat.
export function compareValues<Value = unknown>(
	value1: Value,
	value2: Value,
	options: ValueCompareOptions<Value> = {}
): CompareReturn {
	return REACT_SIMPLE_UTIL.DI.value.compareValues(value1, value2, options, compareValues_default);
}

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
const sameValues_default = <Value = unknown>(
	value1: Value,
	value2: Value,
	options: ValueCompareOptions<Value, boolean> = {}
) => {
	return compareValues(value1, value2, options && {
		...options,
		// we check for equality, if it's less or greater that does not matter
		compareValues: options.compareValues ? (t1, t2, t3) => (options.compareValues!(t1, t2, t3) ? 0 : 1) : undefined
	}) === 0;
};

REACT_SIMPLE_UTIL.DI.value.sameValues = sameValues_default;

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
export const sameValues = <Value = unknown>(
	value1: Value,
	value2: Value,
	options: ValueCompareOptions<Value, boolean> = {}
) => {
	return REACT_SIMPLE_UTIL.DI.value.sameValues(value1, value2, options, sameValues_default);
};

function evaluateValueBinaryOperator_default<Value = unknown>(
	value1: Value,
	value2: Nullable<Value>,
	operator: ValueBinaryOperator,
	options: EvaluateValueBinaryOperatorOptions = {}
): boolean {
	if (options.evaluate) {
		return options.evaluate(value1, value2, operator, options);
	}

	// number
	if (isNumber(value1) || isNumber(value2)) {
		const num1 = options.cultureInfo?.numberFormat
			? tryParseFloat(value1, options.cultureInfo.numberFormat)
			: tryParseFloatISO(value1);

		const num2 = options.cultureInfo?.numberFormat
			? tryParseFloat(value2, options.cultureInfo.numberFormat)
			: tryParseFloatISO(value2);

		if (num1 !== undefined && num2 !== undefined) {
			switch (operator) {
				case "equals":
				case "includes":
				case "startswith":
				case "endswith":
					return num1 === num2;
					
				case "not-equals":
				case "not-includes":
				case "not-startswith":
				case "not-endswith":
					return num1 !== num2;
					
				case "greater": return num1 > num2;
				case "greater-equals": return num1 >= num2;
				case "less": return num1 < num2;
				case "less-equals": return num1 <= num2;

				case "or": return !!(num1 || num2);
				case "and": return !!(num1 && num2);
			}
		}
	}

	// date
	if (isDate(value1) || isDate(value2)) {
		const date1 = options.cultureInfo?.dateFormat
			? tryParseDate(value1 as Date, options.cultureInfo.dateFormat)
			: tryParseDateLocalOrISO(value1 as Date);

		const date2 = options.cultureInfo?.dateFormat
			? tryParseDate(value2 as Date, options.cultureInfo.dateFormat)
			: tryParseDateLocalOrISO(value2 as Date);

		if (date1 !== undefined && date2 !== undefined) {
			switch (operator) {
				case "equals":
				case "includes":
				case "startswith":
				case "endswith":
					return sameDates(date1, date2);

				case "not-equals":
				case "not-includes":
				case "not-startswith":
				case "not-endswith":
					return !sameDates(date1, date2);

				case "greater": return compareDates(date1, date2) > 0;
				case "greater-equals": return compareDates(date1, date2) >= 0;
				case "less": return compareDates(date1, date2) < 0;
				case "less-equals": return compareDates(date1, date2) <= 0;

				case "or": return !!(date1 || date2);
				case "and": return !!(date1 && date2);
			}
		}
	}

	// boolean
	if (isBoolean(value1) || isBoolean(value2)) {
		const bool1 = options.cultureInfo?.booleanFormat
			? tryParseBoolean(value1, options.cultureInfo.booleanFormat)
			: tryParseBooleanLocalOrISO(value1);

		const bool2 = options.cultureInfo?.booleanFormat
			? tryParseBoolean(value2, options.cultureInfo.booleanFormat)
			: tryParseBooleanLocalOrISO(value2);

		if (bool1 !== undefined && bool2 !== undefined) {
			switch (operator) {
				case "equals":
				case "includes":
				case "startswith":
				case "endswith":
					return bool1 === bool2;

				case "not-equals":
				case "not-includes":
				case "not-startswith":
				case "not-endswith":
					return bool1 !== bool2;

				case "greater": return bool1 && !bool2;
				case "greater-equals": return bool1 || !bool2;
				case "less": return !bool1 && bool2;
				case "less-equals": return !bool1 || bool2;

				case "or": return bool1 || bool2;
				case "and": return bool1 && bool2;
			}
		}
	}

	// string
	const s1 = `${value1}`;
	const s2 = `${value2}`;

	switch (operator) {
		case "equals": return sameStrings(s1, s2, options);
		case "includes": return stringIncludes(s1, s2, options);
		case "startswith": return stringStartsWith(s1, s2, options);
		case "endswith": return stringEndsWith(s1, s2, options);

		case "not-equals": return !sameStrings(s1, s2, options);
		case "not-includes": return !stringIncludes(s1, s2, options);
		case "not-startswith": return !stringStartsWith(s1, s2, options);
		case "not-endswith": return !stringEndsWith(s1, s2, options);

		case "greater": return getComparableString(s1, options) > getComparableString(s2, options);
		case "greater-equals": return getComparableString(s1, options) >= getComparableString(s2, options);
		case "less": return getComparableString(s1, options) < getComparableString(s2, options);
		case "less-equals": return getComparableString(s1, options) <= getComparableString(s2, options);

		case "or": return !!(getComparableString(s1, options) || getComparableString(s2, options));
		case "and": return !!(getComparableString(s1, options) && getComparableString(s2, options));
	}

	return false;
}

REACT_SIMPLE_UTIL.DI.value.evaluateValueBinaryOperator = evaluateValueBinaryOperator_default;

export function evaluateValueBinaryOperator<Value = unknown>(
	value1: Value,
	value2: Nullable<Value>,
	operator: ValueBinaryOperator,
	options: EvaluateValueBinaryOperatorOptions = {}
): boolean {
	return REACT_SIMPLE_UTIL.DI.value.evaluateValueBinaryOperator(
		value1, value2, operator, options, evaluateValueBinaryOperator_default
	);
}

function evaluateValueUnaryOperator_default<Value = unknown>(
	value: Value,
	operator: ValueUnaryOperator,
	options: EvaluateValueUnaryOperatorOptions = {}
): boolean {
	if (options.evaluate) {
		return options.evaluate(value, operator, options);
	}

	// unary
	switch (operator) {
		case "empty": return isEmpty(value);
		case "not-empty": return !isEmpty(value);
		case "null-undefined": return isNullOrUndefined(value);
		case "not-null-undefined": return !isNullOrUndefined(value);
	}

	return false;
}

REACT_SIMPLE_UTIL.DI.value.evaluateValueUnaryOperator = evaluateValueUnaryOperator_default;

export function evaluateValueUnaryOperator<Value = unknown>(
	value: Value,
	operator: ValueUnaryOperator,
	options: EvaluateValueUnaryOperatorOptions = {}
): boolean {
	return REACT_SIMPLE_UTIL.DI.value.evaluateValueUnaryOperator(value, operator, options, evaluateValueUnaryOperator_default);
}
