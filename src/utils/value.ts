import { REACT_SIMPLE_UTIL } from "data";
import { compareBooleans, tryParseBoolean, tryParseBooleanLocalOrISO } from "./boolean";
import { compareDates, tryParseDate, tryParseDateLocalOrISO } from "./date";
import { compareNumbers, tryParseFloat, tryParseFloatISO } from "./number";
import { compareStrings } from "./string";
import { CompareReturn, ValueCompareOptions } from "./types";
import { isBoolean, isDate, isNumber, isNullOrUndefined } from "./typing";

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
// understands DATE_FORMATS.ISO and REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat.
 function compareValues_default<Value = unknown>(
	value1: Value,
	value2: Value,
	options?: ValueCompareOptions<Value>
): CompareReturn {
	if (options?.compareValues) {
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
			const num1 = options?.cultureInfo?.numberFormat
				? tryParseFloat(value1, options.cultureInfo.numberFormat)
				: tryParseFloatISO(value1);
			
			const num2 = options?.cultureInfo?.numberFormat
				? tryParseFloat(value2, options.cultureInfo.numberFormat)
				: tryParseFloatISO(value2);

			if (num1 !== undefined && num2 !== undefined) {
				return compareNumbers(num1, num2);
			}
		}

		// date
		if (isDate(value1) || isDate(value2)) {
			const date1 = options?.cultureInfo?.dateFormat
				? tryParseDate(value1 as Date, options.cultureInfo.dateFormat)
				: tryParseDateLocalOrISO(value1 as Date);
			
			const date2 = options?.cultureInfo?.dateFormat
				? tryParseDate(value2 as Date, options.cultureInfo.dateFormat)
				: tryParseDateLocalOrISO(value2 as Date);

			if (date1 !== undefined && date2 !== undefined) {
				return compareDates(date1, date2);
			}
		}

		// boolean
		if (isBoolean(value1) || isBoolean(value2)) {
			const bool1 = options?.cultureInfo?.booleanFormat
				? tryParseBoolean(value1, options.cultureInfo.booleanFormat)
				: tryParseBooleanLocalOrISO(value1);
			
			const bool2 = options?.cultureInfo?.booleanFormat
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
	options?: ValueCompareOptions<Value>
): CompareReturn {
	return REACT_SIMPLE_UTIL.DI.value.compareValues(value1, value2, options || {}, compareValues_default);
}

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
const sameValues_default = <Value = unknown>(
	value1: Value,
	value2: Value,
	options?: ValueCompareOptions<Value, boolean>
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
	options?: ValueCompareOptions<Value, boolean>
) => {
	return REACT_SIMPLE_UTIL.DI.value.sameValues(value1, value2, options || {}, sameValues_default);
};
