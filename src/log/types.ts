export const LOG_LEVELS = {
	none: "none",
	error: "error",
	warning: "warning",
	info: "info",
	debug: "debug",
	trace: "trace"
};

export type LogLevel = keyof typeof LOG_LEVELS;

export type LogImplementation = (logLevel: LogLevel, message: string, args: unknown[]) => void;

export interface LogOptions {
	args?: unknown;
	logLevel?: LogLevel;
}
