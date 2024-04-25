import { CultureInfo } from "utils/cultureInfo";
import { DATE_FORMATS } from "./dateFormat";
import { NUMBER_FORMATS } from "./numberFormat";
import { BOOLEAN_FORMATS } from "./booleanFormat";

export const CULTURE_INFO: {
	readonly 'EN-US': CultureInfo;
	readonly HU: CultureInfo;
} = {
	'EN-US': {
		cultureId: "EN-US",
		dateFormat: DATE_FORMATS["EN-US"],
		numberFormat: NUMBER_FORMATS["EN-US"],
		booleanFormat: BOOLEAN_FORMATS["EN-US"]
	},

	HU: {
		cultureId: "HU",
		dateFormat: DATE_FORMATS.HU,
		numberFormat: NUMBER_FORMATS.HU,
		booleanFormat: BOOLEAN_FORMATS.HU
	}
};
