import { CultureInfo } from "utils/cultureInfo";
import { DATE_FORMATS } from "./dateFormat";
import { NUMBER_FORMATS } from "./numberFormat";
import { BOOLEAN_FORMATS } from "./booleanFormat";

const ISO: CultureInfo = {
	cultureId: "ISO",
	dateFormat: DATE_FORMATS.ISO,
	numberFormat: NUMBER_FORMATS.ISO,
	booleanFormat: BOOLEAN_FORMATS.ISO
};

const EN_US: CultureInfo = {
	cultureId: "EN-US",
	dateFormat: DATE_FORMATS["EN-US"],
	numberFormat: NUMBER_FORMATS["EN-US"],
	booleanFormat: BOOLEAN_FORMATS["EN-US"]
};

const HU: CultureInfo = {
	cultureId: "HU",
	dateFormat: DATE_FORMATS.HU,
	numberFormat: NUMBER_FORMATS.HU,
	booleanFormat: BOOLEAN_FORMATS.HU
};

export const CULTURE_INFO: {
	readonly ISO: CultureInfo;
	readonly 'EN-US': CultureInfo;
	readonly HU: CultureInfo;
	readonly ALL: CultureInfo[];
} = {
	ISO,
	'EN-US': EN_US,
	HU,
	ALL: [ISO, EN_US, HU]
};
