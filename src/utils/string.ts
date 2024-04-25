import { CompareReturn, StringCompareOptions, ValueOrArray } from "./types";
import { getResolvedArray, isArray } from "./typing";

export const getComparableString = (s: string, options?: StringCompareOptions) => {
	if (options?.trim) {
		s = s.trim();
	}

	if (options?.ignoreCase) {
		s = s.toLowerCase();
	}

	return s;
};

export function compareStrings(s1: string, s2: string, options?: StringCompareOptions): CompareReturn {
	s1 = getComparableString(s1, options);
	s2 = getComparableString(s2, options);

	return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
}

export const sameStrings = (s1: string, s2: string, options?: StringCompareOptions) => {
	return compareStrings(s1, s2, options) === 0;
};

export const startsWith = (s: string, prefix: ValueOrArray<string>, options?: StringCompareOptions) => {
	s = getComparableString(s, options);

	return isArray(prefix)
		? prefix.some(t => s.startsWith(getComparableString(t, options)))
		: s.startsWith(getComparableString(prefix, options));
};

export const endsWith = (s: string, suffix: ValueOrArray<string>, options?: StringCompareOptions) => {
	s = getComparableString(s, options);

	return isArray(suffix)
		? suffix.some(t => s.endsWith(getComparableString(t, options))) :
		s.endsWith(getComparableString(suffix, options));
};

// removes all occurences from string
export const trimStart = (s: string, remove: ValueOrArray<string>, options?: StringCompareOptions) => {
	s = getComparableString(s, options);

	if (!s) {
		return "";
	}

	const rarr = getResolvedArray(remove).filter(t => t).map(t => getComparableString(t, options));

	if (!rarr.length) {
		return s;
	}

	let i = 0;
	let last = -1;

	// check all in remove and remove greedy, do it while we can remove
	while (i > last) {
		last = i;

		for (let r of rarr) {
			while (i < s.length && s.startsWith(r, i)) {
				i += r.length;
			}

			if (i >= s.length) {
				break;
			}
		}
	}

	return i >= s.length ? "" : s.substring(i);
};

// removes all occurences from string
export const trimEnd = (s: string, remove: ValueOrArray<string>, options?: StringCompareOptions) => {
	s = getComparableString(s, options);

	if (!s) {
		return "";
	}

	const rarr = getResolvedArray(remove).filter(t => t).map(t => getComparableString(t, options));

	if (!rarr.length) {
		return s;
	}

	let i = s.length;
	let last = i + 1;

	// check all in remove and remove greedy, do it while we can remove
	while (i < last) {
		last = i;

		for (let r of rarr) {
			while (i >= 0 && s.endsWith(r, i)) {
				i -= r.length;
			}

			if (i <= 0) {
				break;
			}
		}
	}

	return i <= 0 ? "" : s.substring(0, i);
};

export function trim(s: string, removes: ValueOrArray<string>, options?: StringCompareOptions): string {
	return trimStart(trimEnd(s, removes, options), removes, options);
}

// will replace the [from, to) range
export const stringReplaceFromTo = (s: string, from: number, to: number, value: string) => {
	return `${s.substring(0, Math.max(from, 0))}${value}${s.substring(Math.min(to, s.length))}`;
};

// will replace the [start, start + length) range
export const stringReplaceAt = (s: string, start: number, length: number, value: string) => {
	return stringReplaceFromTo(s, start, start + length, value);
};

export const stringInsertAt = (s: string, index: number, insert: string) => {
	return (
		index <= 0 ? insert + s :
			index >= s.length - 1 ? s + insert :
				`${s.substring(0, index)}${insert}${s.substring(index)}`
	);
};

// will remove the [from, to) range
export const stringRemoveFromTo = (s: string, from: number, to: number) => {
	return s.substring(0, Math.max(from, 0)) + s.substring(Math.min(to, s.length));
};

// will remove the [start, start + length) range
export const stringRemoveAt = (s: string, start: number, length: number) => {
	return stringRemoveFromTo(s, start, start + length);
};

export const stringReplaceChars = (s: string, replace: (c: string, index: number) => string) => {
	let result = "";
	
	for (let i = 0; i < s.length; i++) {
		result+= replace(s.charAt(i), i);
	}

	return result;
};
