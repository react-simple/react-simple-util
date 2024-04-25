import { GUID_LENGTH, GUID_REGEX, isGuid, newGuid } from "utils";

it('newguid.length', () => {
	expect(newGuid()).toHaveLength(GUID_LENGTH);
});

it('newguid.format', () => {
	expect(newGuid()).toMatch(GUID_REGEX);
});

it('isGuid.true', () => {
	expect(isGuid(newGuid())).toBe(true);
});

it('isGuid.false', () => {
	expect(isGuid('00000000-0000-0000-0000-000X00000000')).toBe(false);
});
