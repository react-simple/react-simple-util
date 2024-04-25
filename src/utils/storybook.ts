// just to have some typing here for args
export interface StorybookComponent<P = never> {
	(args: P): JSX.Element;
	args?: Partial<P>;
	parameters?: object;
}
