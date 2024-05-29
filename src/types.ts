import { LogLevel } from "log/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";

export interface ReactSimpleUtil {
	LOGGING: {
		logLevel: LogLevel;
	};

	CALL_CONTEXT: {
		logLevel: LogLevel;
	},

	// dependency injection; these methods are replacable with custom implementation
	DI: ReactSimpleUtilDependencyInjection;
}
