// Internal artifacts are not exported

import { CultureInfoNumberFormat } from "utils/cultureInfo";

const ISO: CultureInfoNumberFormat = {
	formatId: "ISO",
	decimalSeparator: ".",
	thousandSeparator: ","
};

const EN_US: CultureInfoNumberFormat = {
	formatId: "EN-US",
	decimalSeparator: ".",
	thousandSeparator: ","
};

const HU: CultureInfoNumberFormat = {
	formatId: "HU",
	decimalSeparator: ",",
	thousandSeparator: "."
};

export const NUMBER_FORMATS: {
	readonly ISO: CultureInfoNumberFormat;
	readonly 'EN-US': CultureInfoNumberFormat;
	readonly HU: CultureInfoNumberFormat;
	readonly ALL: CultureInfoNumberFormat[];
} = {
	ISO,
	'EN-US': EN_US,
	HU,
	ALL: [ISO, EN_US, HU]
};
