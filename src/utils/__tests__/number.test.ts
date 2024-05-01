import { NumberFormatOptions, formatNumber, formatNumberLocal, tryParseFloat, tryParseFloatISO, tryParseFloatLocal } from "utils";
import { REACT_SIMPLE_UTIL } from "data";
import { NUMBER_FORMATS } from "internal";

it('formatNumberLocal.default', () => {
	expect(formatNumberLocal(0)).toBe("0");
	expect(formatNumberLocal(1.1)).toBe("1.1");
	expect(formatNumberLocal(10.01)).toBe("10.01");
	expect(formatNumberLocal(100.001)).toBe("100.001");
	expect(formatNumberLocal(1000.0001)).toBe("1,000.000,1");

	expect(formatNumberLocal(-1)).toBe("-1");
	expect(formatNumberLocal(-1.1)).toBe("-1.1");
	expect(formatNumberLocal(-10.01)).toBe("-10.01");
	expect(formatNumberLocal(-100.001)).toBe("-100.001");
	expect(formatNumberLocal(-1000.0001)).toBe("-1,000.000,1");

	expect(formatNumberLocal(123456.123456)).toBe("123,456.123,456");
	expect(formatNumberLocal(1234567.1234567)).toBe("1,234,567.123,456,7");
	expect(formatNumberLocal(12345678.12345678)).toBe("12,345,678.123,456,78");
});

it('formatNumber.customFormat.noThousandSeparator', () => {
	const format = { decimalSeparator: ".", thousandSeparator: "" };

	expect(formatNumber(0, format)).toBe("0");
	expect(formatNumber(1.1, format)).toBe("1.1");
	expect(formatNumber(10.01, format)).toBe("10.01");
	expect(formatNumber(100.001, format)).toBe("100.001");
	expect(formatNumber(1000.0001, format)).toBe("1000.0001");

	expect(formatNumber(-1, format)).toBe("-1");
	expect(formatNumber(-1.1, format)).toBe("-1.1");
	expect(formatNumber(-10.01, format)).toBe("-10.01");
	expect(formatNumber(-100.001, format)).toBe("-100.001");
	expect(formatNumber(-1000.0001, format)).toBe("-1000.0001");

	expect(formatNumber(123456.123456, format)).toBe("123456.123456");
	expect(formatNumber(1234567.1234567, format)).toBe("1234567.1234567");
	expect(formatNumber(12345678.12345678, format)).toBe("12345678.12345678");
});

it('formatNumber.cultureInfo.hu', () => {
	const format = NUMBER_FORMATS.HU;

	expect(formatNumber(0, format)).toBe("0");
	expect(formatNumber(1.1, format)).toBe("1,1");
	expect(formatNumber(10.01, format)).toBe("10,01");
	expect(formatNumber(100.001, format)).toBe("100,001");
	expect(formatNumber(1000.0001, format)).toBe("1.000,000.1");

	expect(formatNumber(-1, format)).toBe("-1");
	expect(formatNumber(-1.1, format)).toBe("-1,1");
	expect(formatNumber(-10.01, format)).toBe("-10,01");
	expect(formatNumber(-100.001, format)).toBe("-100,001");
	expect(formatNumber(-1000.0001, format)).toBe("-1.000,000.1");

	expect(formatNumber(123456.123456, format)).toBe("123.456,123.456");
	expect(formatNumber(1234567.1234567, format)).toBe("1.234.567,123.456.7");
	expect(formatNumber(12345678.12345678, format)).toBe("12.345.678,123.456.78");
});

it('formatNumbeLocal.currentCulture.hu', () => {
	REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

	try {
		expect(formatNumberLocal(0)).toBe("0");
		expect(formatNumberLocal(1.1)).toBe("1,1");
		expect(formatNumberLocal(10.01)).toBe("10,01");
		expect(formatNumberLocal(100.001)).toBe("100,001");
		expect(formatNumberLocal(1000.0001)).toBe("1.000,000.1");

		expect(formatNumberLocal(-1)).toBe("-1");
		expect(formatNumberLocal(-1.1)).toBe("-1,1");
		expect(formatNumberLocal(-10.01)).toBe("-10,01");
		expect(formatNumberLocal(-100.001)).toBe("-100,001");
		expect(formatNumberLocal(-1000.0001)).toBe("-1.000,000.1");

		expect(formatNumberLocal(123456.123456)).toBe("123.456,123.456");
		expect(formatNumberLocal(1234567.1234567)).toBe("1.234.567,123.456.7");
		expect(formatNumberLocal(12345678.12345678)).toBe("12.345.678,123.456.78");
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT;
	}
});

it('formatNumber.cultureInfo.custom', () => {
	const format = { ...REACT_SIMPLE_UTIL.CULTURE_INFO.NUMBER_FORMATS.HU, thousandSeparator: " " };

	expect(formatNumber(0, format)).toBe("0");
	expect(formatNumber(1.1, format)).toBe("1,1");
	expect(formatNumber(10.01, format)).toBe("10,01");
	expect(formatNumber(100.001, format)).toBe("100,001");
	expect(formatNumber(1000.0001, format)).toBe("1 000,000 1");

	expect(formatNumber(-1, format)).toBe("-1");
	expect(formatNumber(-1.1, format)).toBe("-1,1");
	expect(formatNumber(-10.01, format)).toBe("-10,01");
	expect(formatNumber(-100.001, format)).toBe("-100,001");
	expect(formatNumber(-1000.0001, format)).toBe("-1 000,000 1");

	expect(formatNumber(123456.123456, format)).toBe("123 456,123 456");
	expect(formatNumber(1234567.1234567, format)).toBe("1 234 567,123 456 7");
	expect(formatNumber(12345678.12345678, format)).toBe("12 345 678,123 456 78");
});

it('formatNumberLocal.minMaxDecimalDigits', () => {
	const options: NumberFormatOptions = { minDecimalDigits: 2, maxDecimalDigits: 4 };

	expect(formatNumberLocal(0, options)).toBe("0.00");
	expect(formatNumberLocal(1.1, options)).toBe("1.10");
	expect(formatNumberLocal(10.01, options)).toBe("10.01");
	expect(formatNumberLocal(100.001, options)).toBe("100.001");
	expect(formatNumberLocal(1000.0001, options)).toBe("1,000.000,1");

	expect(formatNumberLocal(-1, options)).toBe("-1.00");
	expect(formatNumberLocal(-1.1, options)).toBe("-1.10");
	expect(formatNumberLocal(-10.01, options)).toBe("-10.01");
	expect(formatNumberLocal(-100.001, options)).toBe("-100.001");
	expect(formatNumberLocal(-1000.0001, options)).toBe("-1,000.000,1");

	expect(formatNumberLocal(123456.123456, options)).toBe("123,456.123,4");
	expect(formatNumberLocal(1234567.1234567, options)).toBe("1,234,567.123,4");
	expect(formatNumberLocal(12345678.12345678, options)).toBe("12,345,678.123,4");
});

it('formatNumberLocal.minIntegerDigits', () => {
	const options: NumberFormatOptions = { minIntegerDigits: 3 };

	expect(formatNumberLocal(0, options)).toBe("000");
	expect(formatNumberLocal(1.1, options)).toBe("001.1");
	expect(formatNumberLocal(10.01, options)).toBe("010.01");
	expect(formatNumberLocal(100.001, options)).toBe("100.001");
	expect(formatNumberLocal(1000.0001, options)).toBe("1,000.000,1");

	expect(formatNumberLocal(-1, options)).toBe("-001");
	expect(formatNumberLocal(-1.1, options)).toBe("-001.1");
	expect(formatNumberLocal(-10.01, options)).toBe("-010.01");
	expect(formatNumberLocal(-100.001, options)).toBe("-100.001");
	expect(formatNumberLocal(-1000.0001, options)).toBe("-1,000.000,1");

	expect(formatNumberLocal(123456.123456, options)).toBe("123,456.123,456");
	expect(formatNumberLocal(1234567.1234567, options)).toBe("1,234,567.123,456,7");
	expect(formatNumberLocal(12345678.12345678, options)).toBe("12,345,678.123,456,78");
});

it('tryParseFloatISO', () => {
	expect(tryParseFloatISO("1")).toBe(1);
	expect(tryParseFloatISO("1.1")).toBe(1.1);
	expect(tryParseFloatISO("-1.2")).toBe(-1.2);
	expect(tryParseFloatISO("")).toBe(undefined);
});

it('tryParseFloatISO.cultureIndependent', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

		expect(tryParseFloatISO("1")).toBe(1);
		expect(tryParseFloatISO("1.1")).toBe(1.1);
		expect(tryParseFloatISO("-1.2")).toBe(-1.2);
		expect(tryParseFloatISO("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseFloatLocal.currentCulture.EN-US', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO["EN-US"];

		expect(tryParseFloatLocal("1,000")).toBe(1000);
		expect(tryParseFloatLocal("1,000.1")).toBe(1000.1);
		expect(tryParseFloatLocal("1,000.000,1")).toBe(1000.0001);
		expect(tryParseFloatLocal("-1,000.2")).toBe(-1000.2);
		expect(tryParseFloatLocal("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseFloatLocal.currentCulture.HU', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

		expect(tryParseFloatLocal("1.000")).toBe(1000);
		expect(tryParseFloatLocal("1.000,1")).toBe(1000.1);
		expect(tryParseFloatLocal("1.000,000.1")).toBe(1000.0001);
		expect(tryParseFloatLocal("-1.000,2")).toBe(-1000.2);
		expect(tryParseFloatLocal("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseFloat.cultureInfo.EN-US', () => {
	const format = REACT_SIMPLE_UTIL.CULTURE_INFO["EN-US"].numberFormat;

	expect(tryParseFloat("1,000", format)).toBe(1000);
	expect(tryParseFloat("1,000.1", format)).toBe(1000.1);
	expect(tryParseFloat("1,000.000,1", format)).toBe(1000.0001);
	expect(tryParseFloat("-1,000.2", format)).toBe(-1000.2);
	expect(tryParseFloat("", format)).toBe(undefined);
});

it('tryParseFloatLocal.cultureInfo.HU', () => {
	const format = REACT_SIMPLE_UTIL.CULTURE_INFO.HU.numberFormat;

	expect(tryParseFloat("1.000", format)).toBe(1000);
	expect(tryParseFloat("1.000,1", format)).toBe(1000.1);
	expect(tryParseFloat("1.000,000.1", format)).toBe(1000.0001);
	expect(tryParseFloat("-1.000,2", format)).toBe(-1000.2);
	expect(tryParseFloat("", format)).toBe(undefined);
});
