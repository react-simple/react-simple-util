import type { Meta } from '@storybook/react';
import { useForceUpdate, useUpdateTarget } from './useForceUpdate';
import { StorybookComponent } from '../utils';

const TITLE = "Hooks / useForceUpdate";

const ChildComponent = ({ id, updateIds }: { id: string; updateIds: string[] }) => {
	useUpdateTarget(id);
	const forceUpdate = useForceUpdate();

	return (
		<div>
			<h3>Component {id}</h3>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }} >
				<div>Updated: {(new Date()).toISOString()}</div>
				<div style={{ display: "flex", flexDirection: "row", gap: "1em" }} >
					<input type="button" value="Update this component" onClick={() => forceUpdate()} />

					{updateIds.map(t => (
						<input type="button" key={t} value={`Update Component ${t}`} onClick={() => forceUpdate(t)} />
					))}
				</div>
			</div>
		</div>
	);
};

const Component = () => {
	return (
		<div>
			<ChildComponent id="1" updateIds={["1", "2", "3"]} />
			<ChildComponent id="2" updateIds={["1", "2", "3"]} />
			<ChildComponent id="3" updateIds={["1", "2", "3"]} />
		</div>
	);
};

const Template: StorybookComponent = () => <Component />;

export const Default: StorybookComponent = Template.bind({});

const meta: Meta<typeof useForceUpdate> = {
	component: Component,
	title: TITLE
};

export default meta;
