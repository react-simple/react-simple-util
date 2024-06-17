import { useState } from 'react';
import { joinNonEmptyValues, newGuid } from 'utils';

// Returns permanent unique id using state and guid
export const useUniqueId = (options?: {
	prefix?: string;
	suffix?: string;
	separator?: string; // default is '_'
}) => {
	const [uniqueId] = useState(() => options
		? joinNonEmptyValues([options.prefix, newGuid(), options.suffix], options.separator || "_")
		: newGuid()
	);

	return uniqueId;
};
