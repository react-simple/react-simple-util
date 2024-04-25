import { LogImplementation } from "./types";

// default REACT_SIMPLE_UTIL.LOG_IMPLEMENTATION value
export const logDefaultImplementation: LogImplementation = (logLevel, message, args) => {
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
