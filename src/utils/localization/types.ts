export interface CultureInfoDateFormat {
	readonly formatId: string;

	// supports yyyy, yy, MM, M, dd, d
	readonly dateFormat: string;
	readonly dateFormatRegExp: RegExp; // must contain year, month, day named capturing groups

	readonly dateTimeFormat: {
		// supports H, HH, m, mm, s, ss
		readonly hourMinute: string;
		readonly hourMinuteSecond: string;
		readonly hourMinuteSecondMillisecond: string;
	};

	readonly dateTimeFormatRegExp: RegExp; // must contain year, month, day, hour, (seconds, milliseconds) named capturing groups
}

export interface CultureInfoNumberFormat {
	readonly formatId: string;
	readonly decimalSeparator: string;
	readonly thousandSeparator: string | undefined;
}

export interface CultureInfoBooleanFormat {
	readonly formatId: string;
	readonly true_format: string;
	readonly false_format: string;
	readonly true_synonyms: string[]; // see tryParseBoolean(), must contain true_format, lowercase
	readonly false_synonyms: string[]; // see tryParseBoolean(), must contain true_format, lowercase
}

export interface CultureInfo {
	readonly cultureId: string;
	readonly dateFormat: CultureInfoDateFormat;
	readonly numberFormat: CultureInfoNumberFormat;
	readonly booleanFormat: CultureInfoBooleanFormat;
}
