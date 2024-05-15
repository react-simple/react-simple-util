export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Nullable<T> = T | undefined | null;

export type ObjectKey = string | number | symbol;
export type ValueType = string | number | boolean | Date;

export type ValueOrCallback<Value> = Value | (() => Value);
export type ValueOrCallbackWithArgs<Args, Value> = Value | ((args: Args) => Value);

export type ValueOrArray<Value> = Value | Value[];

export type Guid = string;

export interface StringCompareOptions {
	ignoreCase?: boolean;
	trim?: boolean;
}

export type DatePart = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";

export interface DateTimeFormatOptions {
	seconds?: boolean;
	milliseconds?: boolean;

	// shift time zone offset before converting
	// - specifying 'true' results the same behavior how date.toString() works
	// - specifying 'false' results the same behavior how date.toLocalDateString() works
	utc?: boolean;
}

export interface NumberFormatOptions {
	minIntegerDigits?: number; // specify 2 and 3 will become "03", maximum value: 100
	radix?: number; // default is 10
	minDecimalDigits?: number; // zeroes will be added to reach this length
	maxDecimalDigits?: number; // fractional part will be cut over this part (note: there is no rounding!)
	thousandSeparators?: boolean; // default is 'true'
}

// -1 if first argument is less, 1 if first argument is greater, 0 if compared arguments are equal
export type CompareReturn = -1 | 0 | 1; 

export enum ContentTypeCategory {
	image = "image",
	document = "document",
	text = "text",
	spreadsheet = "spreadsheet"
}

export interface ContentType {
	name: string;
	allowedContentTypes: string[];
	allowedExtensions: string[];
	categories: ContentTypeCategory[];
}

export type StateSetter<State> = (
	state: ValueOrCallbackWithArgs<State, Partial<State>>,
	customMerge?: (oldState: State, newState: Partial<State>) => State
) => State;

export type StateReturn<State> = [State, StateSetter<State>];

// just to have some typing here for args
export interface StorybookComponent<P = never> {
	(args: P): JSX.Element;
	args?: Partial<P>;
	parameters?: object;
}

export interface AccessObjectChildMemberValueOptions {
	pathSeparator?: string; // used only if memberNamesPath is string, not a string array; default is '.'

	// if specified and memberNamesPath starts with "/" then the evaluation will start at the root object, not the parameter object
	rootObj?: unknown;

	// if specified and memberNamesPath starts with "@name" then the evaluation will start at the named object found here, not the parameter object
	namedObjs?: { [name: string]: unknown };
}
