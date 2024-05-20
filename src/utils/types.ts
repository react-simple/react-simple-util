import { CultureInfo } from "./localization/types";

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

	readonly cultureInfo?: Partial<CultureInfo>;
}

export interface ObjectCompareOptions<Result = CompareReturn> extends ValueCompareOptions<unknown, Result> {
	readonly compareObjects?: (
		value1: unknown,
		value2: unknown,
		options: Omit<ObjectCompareOptions<Result> | undefined, "compareObjects"> | undefined
	) => Result;
}

export type DatePart = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";

export interface DateTimeFormatOptions {
	readonly seconds?: boolean;
	readonly milliseconds?: boolean;

	// shift time zone offset before converting
	// - specifying 'true' results the same behavior how date.toString() works
	// - specifying 'false' results the same behavior how date.toLocalDateString() works
	readonly utc?: boolean;
}

export interface NumberFormatOptions {
	readonly minIntegerDigits?: number; // specify 2 and 3 will become "03", maximum value: 100
	readonly radix?: number; // default is 10
	readonly minDecimalDigits?: number; // zeroes will be added to reach this length
	readonly maxDecimalDigits?: number; // fractional part will be cut over this part (note: there is no rounding!)
	readonly thousandSeparators?: boolean; // default is 'true'
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
	readonly name: string;
	readonly allowedContentTypes: string[];
	readonly allowedExtensions: string[];
	readonly categories: ContentTypeCategory[];
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

export interface ObjectChildMemberAccessOptions {
	readonly pathSeparator?: string; // used only if fullQualifiedName is string, not a string array; default is '.'

	// if specified and fullQualifiedName starts with "/" then the evaluation will start at the root object, not the parameter object
	readonly rootObj?: unknown;

	// if specified and fullQualifiedName starts with "@name" then the evaluation will start at the named object found here, not the parameter object
	readonly getNamedObj?: (name: string) => unknown;

	// by default parent[childName] is used
	readonly getMemberValue?: (parent: unknown, name: string, options: ObjectChildMemberAccessOptions) => unknown;
	readonly setMemberValue?: (parent: unknown, name: string, value: unknown, options: ObjectChildMemberAccessOptions) => void;
	readonly deleteMemberValue?: (parent: unknown, name: string, options: ObjectChildMemberAccessOptions) => void;
}

export interface ArrayIterationNode<Item> {
	readonly item: Item;
	readonly level: number; // zero for root level
	readonly globalIndex: number; // sequential number for all nodes, never repeats
	readonly indexInParent: number; // the index of this node in the children of its parent (but not on the level among siblings)
	readonly indexOnLevel: number; // the index of this node on its level among all siblings (not scoped to its parent)
}
