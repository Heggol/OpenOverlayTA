import { useEffect } from 'react';

function useLifecycle(onMount: () => void, onDestroy: () => void) {
	useEffect(() => {
		if (onMount) onMount();
		
		return () => {
			if (onDestroy) onDestroy();
		};
	}, []);
}

export default useLifecycle;