import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel } from "./types";
import { isFunction, isString } from "utils/common";

// currentLogLevel default value is REACT_SIMPLE_LOG.LOG_LEVEL
export const logMessageFilter = (
	logLevel: LogLevel,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	const current = currentLogLevel || REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel;

	switch (logLevel) {
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

const logMessage_default = (
	level: LogLevel,
	message: string,
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	if (logMessageFilter(level, currentLogLevel)) {
		switch (level) {
			case "trace":
				console.trace(message, args);
				break;

			case "debug":
				console.log(message, args);
				break;

			case "info":
				console.info(message, args);
				break;

			case "warning":
				console.warn(message, args);
				break;

			case "error":
				console.error(message, args);
				break;
		}
	}
};

REACT_SIMPLE_UTIL.DI.logging.logMessage = logMessage_default;

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logMessage = (
	logLevel: LogLevel,
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	if (isString(message)) {
		REACT_SIMPLE_UTIL.DI.logging.logMessage(logLevel, message, args, currentLogLevel, logMessage_default);
	}
	else if (isFunction(message) && logMessageFilter(logLevel)) {
		const result = message((t1, t2, t3) => REACT_SIMPLE_UTIL.DI.logging.logMessage(logLevel, t1, t2, t3 || currentLogLevel, logMessage_default));

		if (isString(result)) {
			REACT_SIMPLE_UTIL.DI.logging.logMessage(logLevel, result, args, currentLogLevel, logMessage_default);
		}
	}
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logTrace = (
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	logMessage("trace", message, args, currentLogLevel);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logDebug = (
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	logMessage("debug", message, args, currentLogLevel);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logInfo = (
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	logMessage("info", message, args, currentLogLevel);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logWarning = (
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	logMessage("warning", message, args, currentLogLevel);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logError = (
	message: string | ((log: (message: string, args?: unknown, currentLogLevel?: LogLevel) => void) => string | void),
	args?: unknown,
	currentLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	logMessage("error", message, args, currentLogLevel);
};
