export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Nullable<T> = T | undefined | null;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type ObjectKey = string | number | symbol;
export type ValueType = string | number | boolean | Date;

export type ValueOrCallback<Value> = Value | (() => Value);
export type ValueOrCallbackWithArgs<Args, Value> = Value | ((args: Args) => Value);

export type ValueOrArray<Value> = Value | Value[];

export type Guid = string;

export interface StringCompareOptions {
	readonly ignoreCase?: boolean;
	readonly trim?: boolean;
}

export interface ValueCompareOptions<Value = unknown, Result = CompareReturn> extends StringCompareOptions {
	readonly compareValues?: (
		value1: Value,
		value2: Value,
		options: Omit<ValueCompareOptions<Value, Result>, "compareValues"> | undefined
	) => Result;
}

export interface ObjectCompareOptions<Result = CompareReturn> extends ValueCompareOptions<unknown, Result> {
	readonly compareObjects?: (
		value1: unknown,
		value2: unknown,
		options: Omit<ObjectCompareOptions<Result> | undefined, "compareObjects"> | undefined
	) => Result;
}

export interface EvaluateValueBinaryOperatorOptions<Value = unknown> extends StringCompareOptions {
	readonly evaluate?: (
		value1: Value,
		value2: Value,
		operator: ValueBinaryOperator,
		options: Omit<EvaluateValueBinaryOperatorOptions<Value>, "evaluate"> | undefined
	) => boolean;
}

export interface EvaluateValueUnaryOperatorOptions<Value = unknown> extends StringCompareOptions {
	readonly evaluate?: (
		value: Value,
		operator: ValueUnaryOperator,
		options: Omit<EvaluateValueUnaryOperatorOptions<Value>, "evaluate"> | undefined
	) => boolean;
}

export type DatePart = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";

// -1 if first argument is less, 1 if first argument is greater, 0 if compared arguments are equal
export type CompareReturn = -1 | 0 | 1; 

export enum ContentTypeCategory {
	image = "image",
	document = "document",
	text = "text",
	spreadsheet = "spreadsheet"
}

export interface ContentType {
	readonly name: string;
	readonly allowedContentTypes: string[];
	readonly allowedExtensions: string[];
	readonly categories: ContentTypeCategory[];
}

// just to have some typing here for args
export interface StorybookComponent<P = never> {
	(args: P): JSX.Element;
	args?: Partial<P>;
	parameters?: object;
}

export interface ArrayIterationNode<Item> {
	readonly item: Item;
	readonly level: number; // zero for root level
	readonly globalIndex: number; // sequential number for all nodes, never repeats
	readonly indexInParent: number; // the index of this node in the children of its parent (but not on the level among siblings)
	readonly indexOnLevel: number; // the index of this node on its level among all siblings (not scoped to its parent)
}

export type ValueBinaryOperator =
	| "equals" | "not-equals"
	| "includes" | "not-includes"
	| "startswith" | "not-startswith"
	| "endswith" | "not-endswith"
	| "greater" | "greater-equals"
	| "less" | "less-equals"
	| "or" | "and";

export type ValueUnaryOperator =
	| "empty" | "not-empty" // undefined, null or empty string
	| "null-undefined" | "not-null-undefined";

export interface CallContext<State = unknown> {
	readonly contextId: string;
	readonly contextKey: string;
	readonly contextDepth: number;
	readonly parentContext: CallContext | undefined;
	readonly parentContexts: CallContext[];
	readonly data: State;
}

export interface CallContextReturn extends CallContext {
	readonly complete: (error?: any) => void;
	readonly run: <Result>(action: (onError: (err: any) => void) => Result) => Result;
	readonly runAsync: <Result>(action: (onError: (err: any) => void) => Promise<Result>) => Promise<Result>;
}
