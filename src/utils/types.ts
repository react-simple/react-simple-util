export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Nullable<T> = T | undefined | null;

export type ObjectKey = string | number | symbol;
export type ValueType = string | number | boolean | Date;

export type ValueOrCallback<Value> = Value | (() => Value);
export type ValueOrCallbackWithArgs<Args, Value> = Value | ((args: Args) => Value);

export type ValueOrArray<Value> = Value | Value[];

export interface StringCompareOptions {
	ignoreCase?: boolean;
	trim?: boolean;
}

// -1 if first argument is less, 1 if first argument is greater, 0 if compared arguments are equal
export type CompareReturn = -1 | 0 | 1; 

export type DatePart = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";
