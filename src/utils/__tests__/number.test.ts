import { NumberFormat, NumberFormatOptions, formatNumber, tryParseFloat, tryParseLocalFloat } from "utils";
import { REACT_SIMPLE_UTIL } from "data";

it('formatNumber.default', () => {
	expect(formatNumber(0)).toBe("0");
	expect(formatNumber(1.1)).toBe("1.1");
	expect(formatNumber(10.01)).toBe("10.01");
	expect(formatNumber(100.001)).toBe("100.001");
	expect(formatNumber(1000.0001)).toBe("1,000.000,1");

	expect(formatNumber(-1)).toBe("-1");
	expect(formatNumber(-1.1)).toBe("-1.1");
	expect(formatNumber(-10.01)).toBe("-10.01");
	expect(formatNumber(-100.001)).toBe("-100.001");
	expect(formatNumber(-1000.0001)).toBe("-1,000.000,1");

	expect(formatNumber(123456.123456)).toBe("123,456.123,456");
	expect(formatNumber(1234567.1234567)).toBe("1,234,567.123,456,7");
	expect(formatNumber(12345678.12345678)).toBe("12,345,678.123,456,78");
});

it('formatNumber.customFormat.noThousandSeparator', () => {
	const format: Partial<NumberFormat> = { decimalSeparator: ".", thousandSeparator: "" };

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
	const format = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

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

it('formatNumber.currentCulture.hu', () => {
	REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

	try {
		expect(formatNumber(0)).toBe("0");
		expect(formatNumber(1.1)).toBe("1,1");
		expect(formatNumber(10.01)).toBe("10,01");
		expect(formatNumber(100.001)).toBe("100,001");
		expect(formatNumber(1000.0001)).toBe("1.000,000.1");

		expect(formatNumber(-1)).toBe("-1");
		expect(formatNumber(-1.1)).toBe("-1,1");
		expect(formatNumber(-10.01)).toBe("-10,01");
		expect(formatNumber(-100.001)).toBe("-100,001");
		expect(formatNumber(-1000.0001)).toBe("-1.000,000.1");

		expect(formatNumber(123456.123456)).toBe("123.456,123.456");
		expect(formatNumber(1234567.1234567)).toBe("1.234.567,123.456.7");
		expect(formatNumber(12345678.12345678)).toBe("12.345.678,123.456.78");
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT;
	}
});

it('formatNumber.cultureInfo.custom', () => {
	const format = { cultureInfo: REACT_SIMPLE_UTIL.CULTURE_INFO.HU, thousandSeparator: " " };

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

it('formatNumber.minMaxDecimalDigits', () => {
	const format: NumberFormatOptions = { minDecimalDigits: 2, maxDecimalDigits: 4 };

	expect(formatNumber(0, format)).toBe("0.00");
	expect(formatNumber(1.1, format)).toBe("1.10");
	expect(formatNumber(10.01, format)).toBe("10.01");
	expect(formatNumber(100.001, format)).toBe("100.001");
	expect(formatNumber(1000.0001, format)).toBe("1,000.000,1");

	expect(formatNumber(-1, format)).toBe("-1.00");
	expect(formatNumber(-1.1, format)).toBe("-1.10");
	expect(formatNumber(-10.01, format)).toBe("-10.01");
	expect(formatNumber(-100.001, format)).toBe("-100.001");
	expect(formatNumber(-1000.0001, format)).toBe("-1,000.000,1");

	expect(formatNumber(123456.123456, format)).toBe("123,456.123,4");
	expect(formatNumber(1234567.1234567, format)).toBe("1,234,567.123,4");
	expect(formatNumber(12345678.12345678, format)).toBe("12,345,678.123,4");
});

it('formatNumber.minIntegerDigits', () => {
	const format: NumberFormatOptions = { minIntegerDigits: 3 };

	expect(formatNumber(0, format)).toBe("000");
	expect(formatNumber(1.1, format)).toBe("001.1");
	expect(formatNumber(10.01, format)).toBe("010.01");
	expect(formatNumber(100.001, format)).toBe("100.001");
	expect(formatNumber(1000.0001, format)).toBe("1,000.000,1");

	expect(formatNumber(-1, format)).toBe("-001");
	expect(formatNumber(-1.1, format)).toBe("-001.1");
	expect(formatNumber(-10.01, format)).toBe("-010.01");
	expect(formatNumber(-100.001, format)).toBe("-100.001");
	expect(formatNumber(-1000.0001, format)).toBe("-1,000.000,1");

	expect(formatNumber(123456.123456, format)).toBe("123,456.123,456");
	expect(formatNumber(1234567.1234567, format)).toBe("1,234,567.123,456,7");
	expect(formatNumber(12345678.12345678, format)).toBe("12,345,678.123,456,78");
});

it('tryParseFloat', () => {
	expect(tryParseFloat("1")).toBe(1);
	expect(tryParseFloat("1.1")).toBe(1.1);
	expect(tryParseFloat("-1.2")).toBe(-1.2);
	expect(tryParseFloat("")).toBe(undefined);
});

it('tryParseFloat.cultureIndependent', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

		expect(tryParseFloat("1")).toBe(1);
		expect(tryParseFloat("1.1")).toBe(1.1);
		expect(tryParseFloat("-1.2")).toBe(-1.2);
		expect(tryParseFloat("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseLocalFloat.currentCulture.EN-US', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO["EN-US"];

		expect(tryParseLocalFloat("1,000")).toBe(1000);
		expect(tryParseLocalFloat("1,000.1")).toBe(1000.1);
		expect(tryParseLocalFloat("1,000.000,1")).toBe(1000.0001);
		expect(tryParseLocalFloat("-1,000.2")).toBe(-1000.2);
		expect(tryParseLocalFloat("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseLocalFloat.currentCulture.HU', () => {
	try {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.HU;

		expect(tryParseLocalFloat("1.000")).toBe(1000);
		expect(tryParseLocalFloat("1.000,1")).toBe(1000.1);
		expect(tryParseLocalFloat("1.000,000.1")).toBe(1000.0001);
		expect(tryParseLocalFloat("-1.000,2")).toBe(-1000.2);
		expect(tryParseLocalFloat("")).toBe(undefined);
	}
	finally {
		REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT = REACT_SIMPLE_UTIL.CULTURE_INFO.DEFAULT
	}
});

it('tryParseLocalFloat.cultureInfo.EN-US', () => {
	const format = { cultureInfo: REACT_SIMPLE_UTIL.CULTURE_INFO["EN-US"] };

	expect(tryParseLocalFloat("1,000", format)).toBe(1000);
	expect(tryParseLocalFloat("1,000.1", format)).toBe(1000.1);
	expect(tryParseLocalFloat("1,000.000,1", format)).toBe(1000.0001);
	expect(tryParseLocalFloat("-1,000.2", format)).toBe(-1000.2);
	expect(tryParseLocalFloat("", format)).toBe(undefined);
});

it('tryParseLocalFloat.cultureInfo.HU', () => {
	const format = { cultureInfo: REACT_SIMPLE_UTIL.CULTURE_INFO.HU};

	expect(tryParseLocalFloat("1.000", format)).toBe(1000);
	expect(tryParseLocalFloat("1.000,1", format)).toBe(1000.1);
	expect(tryParseLocalFloat("1.000,000.1", format)).toBe(1000.0001);
	expect(tryParseLocalFloat("-1.000,2", format)).toBe(-1000.2);
	expect(tryParseLocalFloat("", format)).toBe(undefined);
});
