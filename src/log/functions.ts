import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel, LogOptions } from "./types";
import { isFunction, isString } from "utils/common";

// logLevel default value is REACT_SIMPLE_LOG.LOG_LEVEL
export const logMessageFilter = (
	messageLevel: LogLevel,
	configLogLevel?: LogLevel // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
) => {
	const config = configLogLevel || REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel;

	switch (messageLevel) {
		case "trace":
			return config === "trace";

		case "debug":
			return config === "trace" || config === "debug";

		case "info":
			return config === "trace" || config === "debug" || config === "info";

		case "warning":
			return config === "trace" || config === "debug" || config === "info" || config === "warning";

		case "error":
			return config !== "none";
	}
};

const logMessage_default = (
	messageLevel: LogLevel,
	message: string,
	options?: {
		args?: unknown;
		logLevel?: LogLevel; // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
	}
) => {
	if (logMessageFilter(messageLevel, options?.logLevel)) {
		switch (messageLevel) {
			case "trace":
				console.trace(message, options?.args);
				break;

			case "debug":
				console.log(message, options?.args);
				break;

			case "info":
				console.info(message, options?.args);
				break;

			case "warning":
				console.warn(message, options?.args);
				break;

			case "error":
				console.error(message, options?.args);
				break;
		}
	}
};

REACT_SIMPLE_UTIL.DI.logging.logMessage = logMessage_default;

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logMessage = (
	messageLevel: LogLevel,
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	if (isString(message)) {
		REACT_SIMPLE_UTIL.DI.logging.logMessage(messageLevel, message, options || {}, logMessage_default);
	}
	else if (isFunction(message) && logMessageFilter(messageLevel, options?.logLevel)) {
		const result = message((tmessage, toptions) => {
			return REACT_SIMPLE_UTIL.DI.logging.logMessage(
				messageLevel,
				tmessage,
				{
					...toptions,
					logLevel: toptions?.logLevel || options?.logLevel
				},
				logMessage_default);
		});

		if (isString(result)) {
			REACT_SIMPLE_UTIL.DI.logging.logMessage(messageLevel, result, options || {}, logMessage_default);
		}
	}
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logTrace = (
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	logMessage("trace", message, options);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logDebug = (
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	logMessage("debug", message, options);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logInfo = (
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	logMessage("info", message, options);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logWarning = (
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	logMessage("warning", message, options);
};

// message can be a string or a callback function to return the message dynamically or to make arbitrary log calls
export const logError = (
	message: string | ((log: (message: string, options?: LogOptions) => void) => string | void),
	options?: LogOptions
) => {
	logMessage("error", message, options);
};
