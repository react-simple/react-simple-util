import { REACT_SIMPLE_UTIL } from "data";
import { compareBooleans } from "./boolean";
import { compareDates, sameDates } from "./date";
import { compareNumbers } from "./number";
import { compareStrings, getComparableString, sameStrings, stringEndsWith, stringIncludes, stringStartsWith } from "./string";
import {
	CompareReturn, EvaluateValueBinaryOperatorOptions, EvaluateValueUnaryOperatorOptions, Nullable,
	ValueBinaryOperator, ValueCompareOptions, ValueUnaryOperator
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
		if (isNumber(value1) && isNumber(value2)) {
			return compareNumbers(value1, value2);
		}

		// date
		if (isDate(value1) && isDate(value2)) {
			return compareDates(value1, value2);
		}

		// boolean
		if (isBoolean(value1) && isBoolean(value2)) {
			return compareBooleans(value1, value2);
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
	if (isNumber(value1) && isNumber(value2)) {
		switch (operator) {
			case "equals":
			case "includes":
			case "startswith":
			case "endswith":
				return value1 === value2;
					
			case "not-equals":
			case "not-includes":
			case "not-startswith":
			case "not-endswith":
				return value1 !== value2;
					
			case "greater": return value1 > value2;
			case "greater-equals": return value1 >= value2;
			case "less": return value1 < value2;
			case "less-equals": return value1 <= value2;

			case "or": return !!(value1 || value2);
			case "and": return !!(value1 && value2);
		}
	}

	// date
	if (isDate(value1) && isDate(value2)) {
		switch (operator) {
			case "equals":
			case "includes":
			case "startswith":
			case "endswith":
				return sameDates(value1, value2);

			case "not-equals":
			case "not-includes":
			case "not-startswith":
			case "not-endswith":
				return !sameDates(value1, value2);

			case "greater": return compareDates(value1, value2) > 0;
			case "greater-equals": return compareDates(value1, value2) >= 0;
			case "less": return compareDates(value1, value2) < 0;
			case "less-equals": return compareDates(value1, value2) <= 0;

			case "or": return !!(value1 || value2);
			case "and": return !!(value1 && value2);
		}
	}

	// boolean
	if (isBoolean(value1) && isBoolean(value2)) {
		switch (operator) {
			case "equals":
			case "includes":
			case "startswith":
			case "endswith":
				return value1 === value2;

			case "not-equals":
			case "not-includes":
			case "not-startswith":
			case "not-endswith":
				return value1 !== value2;

			case "greater": return value1 && !value2;
			case "greater-equals": return value1 || !value2;
			case "less": return !value1 && value2;
			case "less-equals": return !value1 || value2;

			case "or": return value1 || value2;
			case "and": return value1 && value2;
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
