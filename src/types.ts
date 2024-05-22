import { LogImplementation, LogLevel } from "log/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";

export interface ReactSimpleUtil {
	LOGGING: {
		LOG_LEVEL: LogLevel;
		log: LogImplementation; // set by log/functions.ts
	};

	CALL_CONTEXT: {
		LOG_LEVEL: LogLevel;
	},

	// dependency injection; these methods are replacable with custom implementation
	DI: ReactSimpleUtilDependencyInjection;
}
