import { ReactSimpleUtil } from "./types";

// For depndency injection references. All stub references are set by the respective util files.
const stub: any = () => { };

export const REACT_SIMPLE_UTIL: ReactSimpleUtil = {
	LOGGING: {
		LOG_LEVEL: "none",
		log: stub // set by log/functions.ts
	},

	CALL_CONTEXT: {
		LOG_LEVEL: "none"
	},
		
	DI: {
		// set by utils/array.ts
		array: {
			compareArrays: stub,
			sameArrays: stub
		},
		dictionary: {
			compareDictionaries: stub,
			sameDictionaries: stub
		},
		object: {
			compareObjects: stub,
			sameObjects: stub,
			deepCopyObject: stub,
		},
		objectModel: {
			getObjectChildMember: stub,
			getObjectChildValue: stub,
			setObjectChildValue: stub,
			deleteObjectChildMember: stub
		},
		string: {
			compareStrings: stub,
			sameStrings: stub
		},
		value: {
			compareValues: stub,
			sameValues: stub,
			evaluateValueBinaryOperator: stub,
			evaluateValueUnaryOperator: stub
		}
	}
};
