import { LogLevel } from "log/types";
import { ReactSimpleUtilDependencyInjection } from "types.di";
import { CallContext } from "utils/types";

export interface ReactSimpleUtil {
	LOGGING: {
		logLevel: LogLevel; // for functions in react-simple-util
		defaultLogLevel: LogLevel; // for log() calls which do not specify logLevel (for your app)
	};

	CALLCONTEXT: {
		logLevel: LogLevel;
		allContexts: { [contextId: string]: CallContext };
		currentContext: CallContext | undefined;
	},

	// dependency injection; these methods are replacable with custom implementation
	DI: ReactSimpleUtilDependencyInjection;
}
