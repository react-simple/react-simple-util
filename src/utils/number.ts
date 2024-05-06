import { REACT_SIMPLE_UTIL } from "data";
import { NUMBER_FORMATS } from "internal";
import { CultureInfoNumberFormat } from "./cultureInfo";
import { stringReplaceChars } from "./string";
import { CompareReturn } from "./types";
import { isEmpty, isNumber, isString } from "./typing";

export interface NumberFormatOptions {
	minIntegerDigits?: number; // specify 2 and 3 will become "03", maximum value: 100
	radix?: number; // default is 10
	minDecimalDigits?: number; // zeroes will be added to reach this length
	maxDecimalDigits?: number; // fractional part will be cut over this part (note: there is no rounding!)
}

export function compareNumbers(n1: number, n2: number): CompareReturn {
	return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
}

// uses REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT or the specified format/culture to parse
export function tryParseFloat(
	value: unknown,
	format: Pick<CultureInfoNumberFormat, "decimalSeparator" | "thousandSeparator">
): number | undefined {
	if (isEmpty(value)) {
		return undefined;
	}
	else if (isNumber(value)) {
		return value;
	}
	else {
		const numberFormat = format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.numberFormat;

		const str = (
			numberFormat.decimalSeparator === "." && numberFormat.thousandSeparator === ""
				? `${value}`
				: stringReplaceChars(
					`${value}`,
					t => (
						t === numberFormat.decimalSeparator ? "." :
							t === numberFormat.thousandSeparator ? "" :
								t
					)
				)
		);

		try {
			const number = parseFloat(str);
			return !isNaN(number) ? number : undefined;
		} catch {
			// shall not happen
			return undefined;
		}
	}
}

// uses REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT or the specified format/culture to parse
export function tryParseFloatLocal(value: unknown
): number | undefined {
	return tryParseFloat(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.numberFormat);
}

export function tryParseFloatISO(value: unknown): number | undefined {	
	if (isEmpty(value)) {
		return undefined;
	}
	else if (isNumber(value)) {
		return value;
	}
	else if (isString(value)) {
		try {
			const number = parseFloat(value);
			return isNumber(number) && !isNaN(number) ? number : undefined;
		} catch {
			return undefined;
		}
	}
}

export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

// round up to next whole unit, roundUp(35, 10) will return 40
export const roundDown = (value: number, units: number) => {
	return Math.floor(value / units) * units;
};

// round up to next whole unit, roundUp(35, 10) will return 40
export const roundUp = (value: number, units: number) => {
	return Math.ceil(value / units) * units;
};

// zeroes x100
const LOTS_OF_ZEROES = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

// add thousand separators from right to left at every third position
const addThousandSeparatorsToIntPart = (s: string, thousandSeparator: string | undefined) => {
	if (s.length <= 3 || !thousandSeparator) {
		return s;
	}

	let i = s.length - Math.floor((s.length - 1) / 3) * 3;
	let result = s.substring(0, i);

	// i will exactly hit s.length
	while (i < s.length) {
		result += thousandSeparator + s.substring(i, i + 3) ;
		i += 3;
	}

	return result;
};

// add thousand separators from left to right at every third position
const addThousandSeparatorsToFracPart = (s: string, thousandSeparator: string | undefined) => {
	if (s.length <= 3 || !thousandSeparator) {
		return s;
	}

	let i = 3;
	let result = s.substring(0, 3);

	while (i < s.length) {
		result += thousandSeparator + s.substring(i, i + 3);
		i += 3;
	}

	return result;
};

export function formatNumber(
	value: number,
	format: Pick<CultureInfoNumberFormat, "decimalSeparator" | "thousandSeparator">,
	options?: NumberFormatOptions	
): string {
	const { decimalSeparator, thousandSeparator } = format || REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.numberFormat;
	const { maxDecimalDigits, minDecimalDigits, minIntegerDigits, radix } = options || {};

	const str = Math.abs(value).toString(radix);
	const negativeSign = value < 0 ? "-" : "";
	const decPointIndex = str.indexOf(".");

	if (decPointIndex < 0) {
		// whole numbers are easy
		const intPart = addThousandSeparatorsToIntPart(
			(minIntegerDigits && str.length < minIntegerDigits
				? LOTS_OF_ZEROES.substring(0, minIntegerDigits - str.length) // leading zeroes
				: ""
			) +
			str,
			thousandSeparator
		);

		if (!minDecimalDigits || minDecimalDigits <= 0) {
			return negativeSign + intPart;
		}

		const fracPart = addThousandSeparatorsToFracPart(
			LOTS_OF_ZEROES.substring(0, minDecimalDigits),
			thousandSeparator);

		return `${negativeSign}${intPart}${decimalSeparator}${fracPart}`;
	}
	else {
		// we got a fractional number
		const intPart = addThousandSeparatorsToIntPart(
			(minIntegerDigits && decPointIndex < minIntegerDigits
				? LOTS_OF_ZEROES.substring(0, minIntegerDigits - decPointIndex) // int leading zeroes
				: ""
			) +
			str.substring(0, decPointIndex),
			thousandSeparator
		);

		if (maxDecimalDigits && maxDecimalDigits <= 0) {
			return negativeSign + intPart;
		}
		else {
			const actualFracLength = str.length - decPointIndex - 1;

			const fracPart = addThousandSeparatorsToFracPart(
				str.substring(decPointIndex + 1, Math.min(decPointIndex + 1 + (maxDecimalDigits || 99), str.length)) +
				(minDecimalDigits && actualFracLength < minDecimalDigits
					? LOTS_OF_ZEROES.substring(0, minDecimalDigits - actualFracLength) // fraction trailing zeroes
					: ""
				),
				thousandSeparator
			);

			return `${negativeSign}${intPart}${decimalSeparator}${fracPart}`;
		}		
	}
}

export const formatNumberISO = (value: number, options?: NumberFormatOptions) => {
	return formatNumber(value, NUMBER_FORMATS.ISO, options);
};

export const formatNumberLocal = (value: number, options?: NumberFormatOptions) => {
	return formatNumber(value, REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT.numberFormat, options);
};
