import { REACT_SIMPLE_UTIL } from "data";
import { Nullable } from "./types";

export interface DateFormat {
	readonly dateFormatId: string;

	readonly dateFormat: string;
	readonly dateFormatRegExp: RegExp; // must contain year, month, day named capturing groups

	readonly dateTimeFormat: {
		readonly hourMinute: string;
		readonly hourMinuteSecond: string;
		readonly hourMinuteSecondMillisecond: string;
	};

	readonly dateTimeFormatRegExp: RegExp; // must contain year, month, day, hour, (seconds, milliseconds) named capturing groups
}

export interface NumberFormat {
	readonly numberFormatId: string;

	readonly decimalSeparator: string;
	readonly thousandSeparator: string | undefined;
}

export interface BooleanFormat {
	readonly booleanFormatId: string;
	readonly true_format: string;
	readonly false_format: string;
	readonly true_synonyms: string[]; // see tryParseBoolean(), must contain true_format, lowercase
}

export interface CultureInfo {
	readonly cultureId: string;
	readonly dateFormat: DateFormat;
	readonly numberFormat: NumberFormat;
	readonly booleanFormat: BooleanFormat;
}

export type CultureInfoFormat<Format> =
	| Partial<Format>
	| CultureInfo
	| { cultureInfo: CultureInfo };

export function getResolvedCultureInfoFormat<Format>(
	format: Nullable<CultureInfoFormat<Format>>,
	getFormat: (cultureInfo: CultureInfo) => Format
): Format {
	return (
		!format ? getFormat(REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT) : // default format
			(format as CultureInfo).cultureId ? getFormat(format as CultureInfo) :
				(format as { cultureInfo: CultureInfo }).cultureInfo ? getFormat((format as { cultureInfo: CultureInfo }).cultureInfo) :
					{
						// override defaults
						...getFormat(REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT),
						...format as Partial<Format>
					}
	);
}
