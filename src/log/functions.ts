import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel } from "./types";

export const logTrace = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.logLevel === "trace") {
		REACT_SIMPLE_UTIL.LOGGING.executeLog("trace", message, args);
	}
};

export const logDebug = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.logLevel === "debug" || REACT_SIMPLE_UTIL.LOGGING.logLevel === "trace") {
		REACT_SIMPLE_UTIL.LOGGING.executeLog("debug", message, args);
	}
};

export const logInfo = (message: string, ...args: unknown[]) => {
	if (
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "info" ||
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "debug" ||
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "trace"
	) {
		REACT_SIMPLE_UTIL.LOGGING.executeLog("info", message, args);
	}
};

export const logWarning = (message: string, ...args: unknown[]) => {
	if (
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "info" ||
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "debug" ||
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "trace" ||
		REACT_SIMPLE_UTIL.LOGGING.logLevel === "warning"
	) {
		REACT_SIMPLE_UTIL.LOGGING.executeLog("warning", message, args);
	}
};

export const logError = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.logLevel !== "none") {
		REACT_SIMPLE_UTIL.LOGGING.executeLog("error", message, args);
	}
};

export const logMessage = (logLevel: LogLevel, message: string, ...args: unknown[]) => {
	switch (logLevel) {
		case "trace":
			logTrace(message, ...args);
			break;

		case "debug":
			logDebug(message, ...args);
			break;

		case "info":
			logInfo(message, ...args);
			break;

		case "warning":
			logWarning(message, ...args);
			break;

		case "error":
			logError(message, ...args);
			break;
	}
};

// Init dependency injection
REACT_SIMPLE_UTIL.LOGGING.executeLog = (logLevel, message, args) => {
	switch (logLevel) {
		case "info":
			console.info(message, ...args);
			break;

		case "warning":
			console.warn(message, ...args);
			break;

		case "error":
			console.error(message, ...args);
			break;

		// trace, debug
		default:
			console.log(message, ...args);
			break;
	}
};
