import { LogLevel } from "log/types";
import {
	CompareReturn, ObjectCompareOptions, StringCompareOptions, ValueCompareOptions, Nullable, EvaluateValueBinaryOperatorOptions,
	ValueBinaryOperator, ValueUnaryOperator, EvaluateValueUnaryOperatorOptions
} from "utils/types";

export interface ReactSimpleUtilDependencyInjection {
	logging: {
		logMessage: (
			level: LogLevel,
			message: string,
			args: unknown,
			currentLogLevel: LogLevel | undefined, // defult is REACT_SIMPLE_UTIL.LOGGING.defaultLogLevel
			defaultImpl: ReactSimpleUtilDependencyInjection["logging"]["logMessage"]
		) => void; 
	};

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
