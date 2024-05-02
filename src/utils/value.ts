import { compareBooleans, tryParseBooleanLocalOrISO } from "./boolean";
import { compareDates, tryParseDateLocalOrISO } from "./date";
import { compareNumbers, tryParseFloatISO } from "./number";
import { compareStrings } from "./string";
import { CompareReturn, StringCompareOptions } from "./types";
import { isBoolean, isDate, isNumber, isNullOrUndefined } from "./typing";

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
// understands DATE_FORMATS.ISO and REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.dateFormat.
export function compareValues(value1: unknown, value2: unknown, options?: StringCompareOptions): CompareReturn {
	if (value1 === value2) {
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
			const num1 = tryParseFloatISO(value1);
			const num2 = tryParseFloatISO(value2);

			if (num1 !== undefined && num2 !== undefined) {
				return compareNumbers(num1, num2);
			}
		}

		// date
		if (isDate(value1) || isDate(value2)) {
			const date1 = tryParseDateLocalOrISO(value1 as Date);
			const date2 = tryParseDateLocalOrISO(value2 as Date);

			if (date1 !== undefined && date2 !== undefined) {
				return compareDates(date1, date2);
			}
		}

		// boolean
		if (isBoolean(value1) || isBoolean(value2)) {
			const bool1 = tryParseBooleanLocalOrISO(value1);
			const bool2 = tryParseBooleanLocalOrISO(value2);

			if (bool1 !== undefined && bool2 !== undefined) {
				return compareBooleans(bool1, bool2);
			}
		}

		// string
		return compareStrings(`${value1}`, `${value2}`, options);
	}
}

// compares the two values based on their recognized types.
// considers undefined and null to be equal.
export const sameValues = (value1: unknown, value2: unknown, options?: StringCompareOptions) => {
	return compareValues(value1, value2, options) === 0;
};
