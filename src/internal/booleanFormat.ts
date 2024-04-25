// Internal artifacts are not exported

import { BooleanFormat } from "utils/cultureInfo";

export const BOOLEAN_FORMATS: {
	readonly 'EN-US': BooleanFormat;
	readonly HU: BooleanFormat;
} = {
	'EN-US': {
		booleanFormatId: "EN-US",
		true_format: "True",
		false_format: "False",
		true_synonyms: ["yes", "y", "1", "true", "on", "checked", "enabled", "active"]
	},

	HU: {
		booleanFormatId: "HU",
		true_format: "Igen",
		false_format: "Nem",
		true_synonyms: ["yes", "y", "1", "true", "on", "checked", "enabled", "active", "igen", "i", "be"]
	}
};
