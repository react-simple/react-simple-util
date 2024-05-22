import { LogImplementation, LogLevel } from "log/types";
import { CultureInfo } from "./utils/localization/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";

export interface ReactSimpleUtil {
	LOGGING: {
		LOG_LEVEL: LogLevel;
		log: LogImplementation; // set by log/functions.ts
	};

	readonly CULTURE_INFO: {
		CURRENT: CultureInfo;
		readonly DEFAULT: CultureInfo;
	};

	CALL_CONTEXT: {
		LOG_LEVEL: LogLevel;
	},

	// dependency injection; these methods are replacable with custom implementation
	DI: ReactSimpleUtilDependencyInjection;
}
