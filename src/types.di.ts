import { CultureInfoBooleanFormat, CultureInfoDateFormat, CultureInfoNumberFormat } from "./utils/localization/types";
import {
	CompareReturn, DateTimeFormatOptions, NumberFormatOptions, GetObjectChildMemberOptions, ObjectCompareOptions, StringCompareOptions,
	ValueCompareOptions, ValueOrArray, GetObjectChildMemberReturn, Nullable, EvaluateValueBinaryOperatorOptions, ValueBinaryOperator,
	ValueUnaryOperator, EvaluateValueUnaryOperatorOptions
} from "utils/types";

export interface ReactSimpleUtilDependencyInjection {
	// set by utils/array.ts
	array: {
		compareArrays: <T>(
			arr1: T[],
			arr2: T[],
			options: ValueCompareOptions<T>,
			defaultImpl: ReactSimpleUtilDependencyInjection["array"]["compareArrays"]
		) => CompareReturn;

		sameArrays: <T>(
			arr1: T[],
			arr2: T[],
			options: ValueCompareOptions<T, boolean>,
			defaultImpl: ReactSimpleUtilDependencyInjection["array"]["sameArrays"]
		) => boolean;
	};

	boolean: {
		tryParseBoolean: (
			value: unknown,
			formats: ValueOrArray<Pick<CultureInfoBooleanFormat, "true_synonyms">>,
			defaultImpl: ReactSimpleUtilDependencyInjection["boolean"]["tryParseBoolean"]
		) => boolean | undefined;

		formatBoolean: (
			value: boolean,
			format: Pick<CultureInfoBooleanFormat, "true_format" | "false_format">,
			defaultImpl: ReactSimpleUtilDependencyInjection["boolean"]["formatBoolean"]
		) => string;
	};

	date: {
		tryParseDate: (
			value: Date | string | number,
			formats: ValueOrArray<CultureInfoDateFormat>,
			defaultImpl: ReactSimpleUtilDependencyInjection["date"]["tryParseDate"]
		) => Date | undefined;

		formatDate: (
			value: Date,
			format: Pick<CultureInfoDateFormat, "dateFormat">,
			options: Pick<DateTimeFormatOptions, "utc">,
			defaultImpl: ReactSimpleUtilDependencyInjection["date"]["formatDate"]
		) => string;

		formatDateTime: (
			value: Date,
			format: Pick<CultureInfoDateFormat, "dateTimeFormat">,
			options: DateTimeFormatOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["date"]["formatDateTime"]
		) => string;
	};

	dictionary: {
		compareDictionaries: <Value>(
			dict1: Record<string, Value>,
			dict2: Record<string, Value>,
			options: ObjectCompareOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["dictionary"]["compareDictionaries"]
		) => CompareReturn;

		sameDictionaries: <Value>(
			dict1: Record<string, Value>,
			dict2: Record<string, Value>,
			options: ObjectCompareOptions<boolean>,
			defaultImpl: ReactSimpleUtilDependencyInjection["dictionary"]["sameDictionaries"]
		) => boolean;
	};

	number: {
		tryParseFloat: (
			value: unknown,
			format: Pick<CultureInfoNumberFormat, "decimalSeparator" | "thousandSeparator">,
			defaultImpl: ReactSimpleUtilDependencyInjection["number"]["tryParseFloat"]
		) => number | undefined;

		formatNumber: (
			value: number,
			format: Pick<CultureInfoNumberFormat, "decimalSeparator" | "thousandSeparator">,
			options: NumberFormatOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["number"]["formatNumber"]
		) => string;
	};

	object: {
		compareObjects: (
			obj1: object,
			obj2: object,
			options: ObjectCompareOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["compareObjects"]
		) => CompareReturn;

		sameObjects: (
			obj1: object,
			obj2: object,
			options: ObjectCompareOptions<boolean>,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["sameObjects"]
		) => boolean;

		deepCopyObject: <Obj extends object>(
			obj: Obj,
			transformValue: ((value: unknown, key: string | number, obj: unknown) => unknown) | undefined,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["deepCopyObject"]
		) => Obj;

		getObjectChildMember: <ValueType = unknown, RootObj extends object = any>(
			rootObj: RootObj,
			fullQualifiedName: ValueOrArray<string>,
			options: GetObjectChildMemberOptions<ValueType>,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["getObjectChildMember"]
		) => GetObjectChildMemberReturn<ValueType, RootObj>;
	};

	string: {
		compareStrings: (
			s1: string,
			s2: string,
			options: StringCompareOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["string"]["compareStrings"]
		) => CompareReturn;

		sameStrings: (
			s1: string,
			s2: string,
			options: StringCompareOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["string"]["sameStrings"]
		) => boolean;
	};

	value: {
		compareValues: <Value = unknown>(
			value1: Value,
			value2: Value,
			options: ValueCompareOptions<Value>,
			defaultImpl: ReactSimpleUtilDependencyInjection["value"]["compareValues"]
		) => CompareReturn;

		sameValues: <Value = unknown>(
			value1: Value,
			value2: Value,
			options: ValueCompareOptions<Value, boolean>,
			defaultImpl: ReactSimpleUtilDependencyInjection["value"]["sameValues"]
		) => boolean;

		evaluateValueBinaryOperator: <Value = unknown>(
			value1: Value,
			value2: Nullable<Value>,
			operator: ValueBinaryOperator,
			options: EvaluateValueBinaryOperatorOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["value"]["evaluateValueBinaryOperator"]
		) => boolean;

		evaluateValueUnaryOperator: <Value = unknown>(
			value: Value,
			operator: ValueUnaryOperator,
			options: EvaluateValueUnaryOperatorOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["value"]["evaluateValueUnaryOperator"]
		) => boolean;
	}
}
