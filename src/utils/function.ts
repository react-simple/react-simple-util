import { ValueOrCallback, ValueOrCallbackWithArgs } from "./types";
import { isFunction } from "./typing";

export function calculate<In, Out>(value: In, calc: (value: In) => Out): Out {
	return calc(value);
}

export function calculate2<In, Int, Out>(
	value: In,
	calc: (value: In) => Int,
	calc2: (value2: Int, value1: In) => Out
): Out {
	return calc2(calc(value), value);
}

export function calculate3<In, Int1, Int2, Out>(
	value: In,
	calc: (value: In) => Int1,
	calc2: (value2: Int1, value1: In) => Int2,
	calc3: (value3: Int2, value2: Int1, value1: In) => Out
): Out {
	const value2 = calc(value);
	return calc3(calc2(value2, value), value2, value);
}
