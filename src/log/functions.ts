import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel } from "./types";
import { ValueOrCallback } from "utils/types";
import { getResolvedCallbackValue } from "utils/common";

// currentLogLevel default value is REACT_SIMPLE_LOG.LOG_LEVEL
export const logMessageFilter = (messageLogLevel: LogLevel, currentLogLevel?: LogLevel) => {
	const current = currentLogLevel || REACT_SIMPLE_UTIL.LOGGING.logLevel;

	switch (messageLogLevel) {
		case "trace":
			return current === "trace";

		case "debug":
			return current === "trace" || current === "debug";

		case "info":
			return current === "trace" || current === "debug" || current === "info";

		case "warning":
			return current === "trace" || current === "debug" || current === "info" || current === "warning";

		case "error":
			return current !== "none";
	}
};

const logMessage_default = (logLevel: LogLevel, message:ValueOrCallback<string>, ...args: ValueOrCallback<unknown>[]) => {
	if (logMessageFilter(logLevel)) {
		const messageResolved = getResolvedCallbackValue(message);
		const argsResolved = args.map(t => getResolvedCallbackValue(t));
		
		switch (logLevel) {
			case "trace":
				logTrace(messageResolved, ...argsResolved);
				break;

			case "debug":
				logDebug(messageResolved, ...argsResolved);
				break;

			case "info":
				logInfo(messageResolved, ...argsResolved);
				break;

			case "warning":
				logWarning(messageResolved, ...argsResolved);
				break;

			case "error":
				logError(messageResolved, ...argsResolved);
				break;
		}
	}
};

REACT_SIMPLE_UTIL.DI.logging.logMessage = logMessage_default;

export const logMessage = (logLevel: LogLevel, message: ValueOrCallback<string>, ...args: ValueOrCallback<unknown>[]) => {
	REACT_SIMPLE_UTIL.DI.logging.logMessage(logLevel, message, args, logMessage_default);
};

export const logTrace = (message: string, ...args: unknown[]) => {
	logMessage("trace", message, ...args);
};

export const logDebug = (message: string, ...args: unknown[]) => {
	logMessage("debug", message, ...args);
};

export const logInfo = (message: string, ...args: unknown[]) => {
	logMessage("info", message, ...args);
};

export const logWarning = (message: string, ...args: unknown[]) => {
	logMessage("warning", message, ...args);
};

export const logError = (message: string, ...args: unknown[]) => {
	logMessage("error", message, ...args);
};
