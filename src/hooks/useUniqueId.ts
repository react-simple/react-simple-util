import { useState } from 'react';
import { joinNonEmptyValues, newGuid } from 'utils';

// Returns permanent unique id using state and guid
export const useUniqueId = ({ prefix, suffix, separator = "_" }: {
	prefix?: string;
	suffix?: string;
	separator?: string; // default is '_'
}) => {
	const [uniqueId] = useState(() => joinNonEmptyValues([prefix, newGuid(), suffix], separator));
	return uniqueId;
};
