import { ReactSimpleUtil } from "./types";

// For depndency injection references. All stub references are set by the respective util files.
const stub: any = () => { };

export const REACT_SIMPLE_UTIL: ReactSimpleUtil = {
	LOGGING: {
		logLevel: "error", // for functions in react-simple-util
		defaultLogLevel: "error" // for log() calls which do not specify currentLogLevel (for your app)
	},

	CALL_CONTEXT: {
		logLevel: "error"
	},
		
	DI: {
		logging: {
			logMessage: stub,
		},

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
