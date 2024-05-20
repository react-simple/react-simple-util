import { CULTURE_INFO } from "./utils/localization";
import { ReactSimpleUtil } from "./types";
import { LOG_LEVELS } from "log";

const stub: any = () => { };

export const REACT_SIMPLE_UTIL: ReactSimpleUtil = {
	LOGGING: {
		logLevel: "none",
		executeLog: stub // set by log/functions.ts
	},

	CULTURE_INFO: {
		CURRENT: CULTURE_INFO["EN-US"],
		DEFAULT: CULTURE_INFO["EN-US"]
	},

	CALL_CONTEXT: {
		logLevelDefault: "none"
	},
		
	DI: {
		// set by utils/array.ts
		array: {
			compareArrays: stub,
			sameArrays: stub
		},
		boolean: {
			tryParseBoolean: stub,
			formatBoolean: stub
		},
		date: {
			tryParseDate: stub,
			formatDate: stub,
			formatDateTime: stub
		},
		dictionary: {
			compareDictionaries: stub,
			sameDictionaries: stub
		},
		number: {
			tryParseFloat: stub,
			formatNumber: stub
		},
		object: {
			compareObjects: stub,
			sameObjects: stub,
		},
		string: {
			compareStrings: stub,
			sameStrings: stub
		},
		value: {
			compareValues: stub,
			sameValues: stub
		}
	}
};
