import { LogImplementation, LogLevel } from "log/types";
import { CultureInfo } from "./utils/localization/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";

export interface ReactSimpleUtil {
	LOGGING: {
		logLevel: LogLevel;
		executeLog: LogImplementation; // set by log/functions.ts
	};

	readonly CULTURE_INFO: {
		CURRENT: CultureInfo;
		readonly DEFAULT: CultureInfo;
	};

	CALL_CONTEXT: {
		logLevelDefault: LogLevel;
	},

	// dependency injection; these methods are replacable
	DI: ReactSimpleUtilDependencyInjection;
}
