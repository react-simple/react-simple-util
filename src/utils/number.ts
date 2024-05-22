import { CompareReturn } from "./types";

export function compareNumbers(n1: number, n2: number): CompareReturn {
	return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
}

export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

// round up to next whole unit, roundUp(35, 10) will return 40
export const roundDown = (value: number, units: number) => {
	return Math.floor(value / units) * units;
};

// round up to next whole unit, roundUp(35, 10) will return 40
export const roundUp = (value: number, units: number) => {
	return Math.ceil(value / units) * units;
};
