import { LogLevel } from "log/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";

export interface ReactSimpleUtil {
	LOGGING: {
		logLevel: LogLevel; // for functions in react-simple-util
		defaultLogLevel: LogLevel; // for log() calls which do not specify currentLogLevel (for your app)
	};

	CALL_CONTEXT: {
		logLevel: LogLevel;
	},

	// dependency injection; these methods are replacable with custom implementation
	DI: ReactSimpleUtilDependencyInjection;
}
