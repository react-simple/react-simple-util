import { useCallback, useEffect, useState } from 'react';
import { useUniqueId } from './useUniqueId';

const UPDATE_TARGETS: {
	[targetId: string]: {
		[uniqueId: string]: () => void;
	}
} = {};

// Returns function to update the component
export const useForceUpdate = () => {
	const [tick, setTick] = useState(-1);

	// if targetId is not specified it will update the caller component
	// if specified will update all parent components of useUpdateTarget() with same targetId
	const forceUpdate = useCallback(
		(targetId?: string) => {
			if (targetId) {
				Object.values(UPDATE_TARGETS[targetId] || {}).forEach(t => t());
			} else {
				setTick(tick => (tick + 1) & 0x7fffffff);
			}
		},
		[tick]);

	return forceUpdate;
};

// can be used to update components/hooks with particular targetId
export const useUpdateTarget = (
	targetId: string,
	onUpdated?: () => void
) => {
	const uniqueId = useUniqueId();
	const forceUpdate = useForceUpdate(); // update this

	useEffect(
		() => {
			// Initialize
			UPDATE_TARGETS[targetId] = {
				...UPDATE_TARGETS[targetId],
				[uniqueId]: () => {
					forceUpdate();
					onUpdated?.();
				}
			};

			return () => {
				// Finalize
				delete UPDATE_TARGETS[targetId][uniqueId];
			};
		},
		[]);
};
