import {
	compareStrings, getComparableString, sameStrings, stringInsertAt, stringRemoveAt, stringRemoveFromTo, stringReplaceAt, stringReplaceFromTo,
	trim, trimEnd, trimStart
} from "utils";

it('trimStart', () => {
	expect(trimStart("  abc123abc123456xxx  ", ["123 ", "ABC", " 456"], { ignoreCase: true, trim: true })).toBe("xxx");
});

it('trimEnd', () => {
	expect(trimEnd("  xxxabc123abc123456  ", ["123 ", "ABC", " 456"], { ignoreCase: true, trim: true })).toBe("xxx");
});

it('trim', () => {
	expect(trim("  abc123abcxxx123456  ", ["123 ", "ABC", " 456"], { ignoreCase: true, trim: true })).toBe("xxx");
});

it('getComparableString', () => {
	expect(getComparableString("  abc123ABC  ", { ignoreCase: true, trim: true })).toBe("abc123abc");
});

it('compareStrings.less', () => {
	expect(compareStrings("a", "  B  ", { ignoreCase: true, trim: true })).toBe(-1);
});

it('compareStrings.greater', () => {
	expect(compareStrings("c", "  B  ", { ignoreCase: true, trim: true })).toBe(1);
});

it('compareStrings.equals', () => {
	expect(compareStrings("c", "  C  ", { ignoreCase: true, trim: true })).toBe(0);
});

it('sameStrings.true', () => {
	expect(sameStrings("c", "  C  ", { ignoreCase: true, trim: true })).toBe(true);
});

it('sameStrings.false', () => {
	expect(sameStrings("c", "  C  ")).toBe(false);
});

it('stringReplaceFromTo', () => {
	expect(stringReplaceFromTo("123abc456", 3, 6, "xxx")).toBe("123xxx456");
});

it('stringReplaceAt', () => {
	expect(stringReplaceAt("123abc456", 3, 3, "xxx")).toBe("123xxx456");
});

it('stringRemoveFromTo', () => {
	expect(stringRemoveFromTo("123abc456", 3, 6)).toBe("123456");
});

it('stringRemoveAt', () => {
	expect(stringRemoveAt("123abc456", 3, 3)).toBe("123456");
});

it('stringInsertAt', () => {
	expect(stringInsertAt("123456", 3, "xxx")).toBe("123xxx456");
});
