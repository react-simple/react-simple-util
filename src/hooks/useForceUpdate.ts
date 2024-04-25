import { useCallback, useState } from 'react';

// Returns function to update the component
export const useForceUpdate = () => {
  const [tick, setTick] = useState(-1);
	const update = useCallback(() => setTick(tick => (tick + 1) & 0x7fffffff), [tick]);
  return update;
};
