export interface LocalFormat {
	readonly formatId: string;
}

export interface DateFormat extends LocalFormat {
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

export interface NumberFormat extends LocalFormat {
	readonly decimalSeparator: string;
	readonly thousandSeparator: string | undefined;
}

export interface BooleanFormat extends LocalFormat {
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
