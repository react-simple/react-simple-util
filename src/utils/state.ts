import { ValueOrCallbackWithArgs } from "./types";

export type StateSetter<State> = (
	state: ValueOrCallbackWithArgs<State, Partial<State>>,
	customMerge?: (oldState: State, newState: Partial<State>) => State
) => State;

export type StateReturn<State> = [State, StateSetter<State>];
