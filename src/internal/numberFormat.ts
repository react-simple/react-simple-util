// Internal artifacts are not exported

import { NumberFormat } from "utils/cultureInfo";

export const NUMBER_FORMATS: {
	readonly 'EN-US': NumberFormat;
	readonly HU: NumberFormat;
} = {
	'EN-US': {
		numberFormatId: "EN-US",
		decimalSeparator: ".",
		thousandSeparator: ","
	},

	HU: {
		numberFormatId: "HU",
		decimalSeparator: ",",
		thousandSeparator: "."
	}
};
