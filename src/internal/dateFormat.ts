// Internal artifacts are not exported

import { CultureInfoDateFormat } from "utils/cultureInfo";

const ISO: CultureInfoDateFormat = {
	formatId: "ISO",
	dateFormat: "yyyy-MM-dd",
	dateFormatRegExp: /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})$/,

	dateTimeFormat: {
		hourMinute: "yyyy-MM-ddTHH:mm",
		hourMinuteSecond: "yyyy-MM-ddTHH:mm:ss",
		hourMinuteSecondMillisecond: "yyyy-MM-ddTHH:mm:ss.fff"
	},

	// when parsing we are more relaxed
	dateTimeFormatRegExp: /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})T(?<hour>\d{1,2}):(?<minute>\d{1,2})(:(?<second>\d{1,2})(.(?<millisecond>\d+))?)?Z?$/,
};

const EN_US: CultureInfoDateFormat = {
	formatId: "EN-US",
	dateFormat: "MM/dd/yyyy",
	dateFormatRegExp: /^(?<month>\d{1,2})[.-\/](?<day>\d{1,2})[.-\/](?<year>(\d{2}|\d{4}))\.?$/,

	dateTimeFormat: {
		hourMinute: "MM/dd/yyyy HH:mm",
		hourMinuteSecond: "MM/dd/yyyy HH:mm:ss",
		hourMinuteSecondMillisecond: "MM/dd/yyyy HH:mm:ss.fff",
	},

	dateTimeFormatRegExp: /^(?<month>\d{1,2})[.-\/](?<day>\d{1,2})[.-\/](?<year>(\d{2}|\d{4}))\.? +(?<hour>\d{1,2}):(?<minute>\d{1,2})(:(?<second>\d{1,2})(.(?<millisecond>\d+))?)?$/,
};

const HU: CultureInfoDateFormat = {
	formatId: "HU",
	dateFormat: "yyyy.MM.dd.",
	dateFormatRegExp: /^(?<year>(\d{2}|\d{4}))[.-\/](?<month>\d{1,2})[.-\/](?<day>\d{1,2})\.?$/,

	dateTimeFormat: {
		hourMinute: "yyyy.MM.dd. HH:mm",
		hourMinuteSecond: "yyyy.MM.dd. HH:mm:ss",
		hourMinuteSecondMillisecond: "yyyy.MM.dd. HH:mm:ss.fff",
	},

	dateTimeFormatRegExp: /^(?<year>(\d{2}|\d{4}))[.-\/](?<month>\d{1,2})[.-\/](?<day>\d{1,2})\.? +(?<hour>\d{1,2}):(?<minute>\d{1,2})(:(?<second>\d{1,2})(.(?<millisecond>\d+))?)?$/,
};

export const DATE_FORMATS: {
	readonly ISO: CultureInfoDateFormat; // ISO8601
	readonly 'EN-US': CultureInfoDateFormat;
	readonly HU: CultureInfoDateFormat;

	readonly ALL: CultureInfoDateFormat[];
} = {
	ISO,
	'EN-US': EN_US,
	HU,
	ALL: [ISO, EN_US, HU]
};
