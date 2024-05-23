import { sameDates, compareDates } from "utils";

it('compareDates.date.equals', () => {
	expect(compareDates(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(0);
});

it('compareDates.date.less', () => {
	expect(compareDates(new Date(1999, 1, 1), new Date(2000, 1, 1))).toBe(-1);
});

it('compareDates.date.greater', () => {
	expect(compareDates(new Date(2001, 1, 1), new Date(2000, 1, 1))).toBe(1);
});

it('sameDates.date', () => {
	expect(sameDates(new Date(2000, 1, 1), new Date(2000, 1, 1))).toBe(true);
});
