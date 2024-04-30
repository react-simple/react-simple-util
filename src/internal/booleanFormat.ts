// Internal artifacts are not exported

import { BooleanFormat } from "utils/cultureInfo";

const DEFAULT_TRUE_SYNONYMS = ["yes", "y", "1", "true", "on", "checked", "enabled", "active"];

const ISO: BooleanFormat = {
	formatId: "ISO",
	true_format: "true",
	false_format: "false",
	true_synonyms: DEFAULT_TRUE_SYNONYMS
};

const EN_US: BooleanFormat = {
	formatId: "EN-US",
	true_format: "True",
	false_format: "False",
	true_synonyms: DEFAULT_TRUE_SYNONYMS
};

const HU: BooleanFormat = {
	formatId: "HU",
	true_format: "Igen",
	false_format: "Nem",
	true_synonyms: [...DEFAULT_TRUE_SYNONYMS, "igen", "i", "be"]
};

export const BOOLEAN_FORMATS: {
	readonly ISO: BooleanFormat;
	readonly 'EN-US': BooleanFormat;
	readonly HU: BooleanFormat;

	readonly ALL: BooleanFormat[];
} = {
	ISO,
	'EN-US': EN_US,
	HU,
	ALL: [ISO, EN_US, HU]
};
