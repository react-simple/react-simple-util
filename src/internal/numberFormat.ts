// Internal artifacts are not exported

import { NumberFormat } from "utils/cultureInfo";

const ISO: NumberFormat = {
	numberFormatId: "ISO",
	decimalSeparator: ".",
	thousandSeparator: ","
};

const EN_US: NumberFormat = {
	numberFormatId: "EN-US",
	decimalSeparator: ".",
	thousandSeparator: ","
};

const HU: NumberFormat = {
	numberFormatId: "HU",
	decimalSeparator: ",",
	thousandSeparator: "."
};

export const NUMBER_FORMATS: {
	readonly ISO: NumberFormat;
	readonly 'EN-US': NumberFormat;
	readonly HU: NumberFormat;
	readonly ALL: NumberFormat[];
} = {
	ISO,
	'EN-US': EN_US,
	HU,
	ALL: [ISO, EN_US, HU]
};
