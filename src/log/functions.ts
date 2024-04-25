import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel } from "./types";

export const logTrace = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "trace") {
		REACT_SIMPLE_UTIL.LOGGING.LOG_IMPLEMENTATION("trace", message, args);
	}
};

export const logDebug = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "debug" || REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "trace") {
		REACT_SIMPLE_UTIL.LOGGING.LOG_IMPLEMENTATION("debug", message, args);
	}
};

export const logInfo = (message: string, ...args: unknown[]) => {
	if (
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "info" ||
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "debug" ||
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "trace"
	) {
		REACT_SIMPLE_UTIL.LOGGING.LOG_IMPLEMENTATION("info", message, args);
	}
};

export const logWarning = (message: string, ...args: unknown[]) => {
	if (
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "info" ||
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "debug" ||
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "trace" ||
		REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL === "warning"
	) {
		REACT_SIMPLE_UTIL.LOGGING.LOG_IMPLEMENTATION("warning", message, args);
	}
};

export const logError = (message: string, ...args: unknown[]) => {
	if (REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL !== "none") {
		REACT_SIMPLE_UTIL.LOGGING.LOG_IMPLEMENTATION("error", message, args);
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
