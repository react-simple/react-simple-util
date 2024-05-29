import { useCallback, useEffect, useState } from 'react';
import { useUniqueId } from './useUniqueId';
import { ValueOrArray, getResolvedArray } from 'utils';

const UPDATE_TARGETS: {
	[targetId: string]: {
		[uniqueId: string]: (message: unknown) => void;
	}
} = {};

// Returns function to update the component
export const useForceUpdate = () => {
	const [tick, setTick] = useState(-1);

	// if targetId is not specified it will update the caller component
	// if specified will update all parent components of useUpdateTarget() with same targetId
	const forceUpdate = useCallback(
		(targetIds?: ValueOrArray<string>, message?: unknown) => {
			if (targetIds) {
				getResolvedArray(targetIds).forEach(targetId => {
					Object.values(UPDATE_TARGETS[targetId] || {}).forEach(t => t(message));
				});
			} else {
				setTick(tick => (tick + 1) & 0x7fffffff);
			}
		},
		[]);

	return forceUpdate;
};

// can be used to update components/hooks with particular targetId
export const useUpdateTarget = <NotificationMessage = unknown>(
	targetId: string,
	onUpdated?: (message: NotificationMessage) => void
) => {
	const uniqueId = useUniqueId();
	const [state, setState] = useState<{ tick: number; message?: NotificationMessage; }>({ tick: 0 });

	useEffect(
		() => {
			// Initialize
			UPDATE_TARGETS[targetId] = {
				...UPDATE_TARGETS[targetId],
				[uniqueId]: message => {
					// update this
					setState({
						tick: (state.tick + 1) & 0x7fffffff,
						message: message as NotificationMessage
					});

					onUpdated?.(message as NotificationMessage);
				}
			};

			return () => {
				// Finalize
				delete UPDATE_TARGETS[targetId][uniqueId];
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]);

	return state.message;
};
