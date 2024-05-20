import { LogImplementation, LogLevel } from "log/types";
import { CultureInfo, CultureInfoBooleanFormat, CultureInfoDateFormat, CultureInfoNumberFormat } from "./utils/localization/types";
import {
	CompareReturn, DateTimeFormatOptions, NumberFormatOptions, ObjectChildMemberAccessOptions, ObjectCompareOptions, StringCompareOptions,
	ValueCompareOptions, ValueOrArray
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
			obj1: unknown,
			obj2: unknown,
			options: ObjectCompareOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["compareObjects"]
		) => CompareReturn;

		sameObjects: (
			obj1: unknown,
			obj2: unknown,
			options: ObjectCompareOptions<boolean>,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["sameObjects"]
		) => boolean;

		deepCopyObject: <T>(
			obj: T,
			transform: ((value: unknown, key: string | number, obj: unknown) => unknown) | undefined,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["deepCopyObject"]
		) => T;

		getObjectChildMemberValue: (
			currentObj: unknown,
			fullQualifiedName: ValueOrArray<string>,
			options: ObjectChildMemberAccessOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["getObjectChildMemberValue"]
		) => any;

		setObjectChildMemberValue: (
			currentObj: unknown,
			fullQualifiedName: ValueOrArray<string>,
			value: unknown,
			options: ObjectChildMemberAccessOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["setObjectChildMemberValue"]
		) => any;

		deleteObjectChildMember: (
			currentObj: unknown,
			fullQualifiedName: ValueOrArray<string>,
			options: ObjectChildMemberAccessOptions,
			defaultImpl: ReactSimpleUtilDependencyInjection["object"]["deleteObjectChildMember"]
		) => any;
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
	}
}

export interface ReactSimpleUtil {
	readonly LOGGING: {
		logLevel: LogLevel;
		executeLog: LogImplementation; // set by log/functions.ts
	};

	readonly CULTURE_INFO: {
		CURRENT: CultureInfo;
		readonly DEFAULT: CultureInfo;
	};

	readonly CALL_CONTEXT: {
		logLevelDefault: LogLevel;
	},

	// dependency injection; these methods are replacable
	readonly DI: ReactSimpleUtilDependencyInjection;
}
