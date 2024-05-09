import { LogImplementation, LogLevel } from "log/types";
import { logDefaultImplementation } from "./log/logDefaultImplementation"; // avoid circular dependency
import { CultureInfo , CULTURE_INFO } from "./utils/localization";

export const REACT_SIMPLE_UTIL: {
	readonly LOGGING: {
		LOG_LEVEL: LogLevel;
		LOG_IMPLEMENTATION: LogImplementation;
	};

	readonly CULTURE_INFO: {
		CURRENT: CultureInfo;
		readonly DEFAULT: CultureInfo;
	};
} = {
	LOGGING: {
		LOG_LEVEL: "none",
		LOG_IMPLEMENTATION: logDefaultImplementation,
	},

	CULTURE_INFO: {
		CURRENT: CULTURE_INFO["EN-US"],
		DEFAULT: CULTURE_INFO["EN-US"]
	}
};
