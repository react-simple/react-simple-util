import { LogImplementation, LogLevel } from "log/types";
import { logDefaultImplementation } from "./log/logDefaultImplementation"; // avoid circular dependency
import { CULTURE_INFO, DATE_FORMATS, NUMBER_FORMATS } from "internal";
import { CultureInfo } from "./utils";
import { BOOLEAN_FORMATS } from "./internal/booleanFormat";

export const REACT_SIMPLE_UTIL: {
	readonly LOGGING: {
		LOG_LEVEL: LogLevel;
		LOG_IMPLEMENTATION: LogImplementation;
	};

	readonly CULTURE_INFO: typeof CULTURE_INFO & {
		CURRENT: CultureInfo;
		readonly DEFAULT: CultureInfo;

		readonly DATE_FORMATS: typeof DATE_FORMATS;
		readonly NUMBER_FORMATS: typeof NUMBER_FORMATS;
		readonly BOOLEAN_FORMATS: typeof BOOLEAN_FORMATS;
	};
} = {
	LOGGING: {
		LOG_LEVEL: "none",
		LOG_IMPLEMENTATION: logDefaultImplementation,
	},

	CULTURE_INFO: {
		...CULTURE_INFO,

		CURRENT: CULTURE_INFO["EN-US"],
		DEFAULT: CULTURE_INFO["EN-US"],

		DATE_FORMATS,
		NUMBER_FORMATS,
		BOOLEAN_FORMATS
	}
};
