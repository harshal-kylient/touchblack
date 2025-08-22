import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import useGetStudioFloors from '@network/useGetStudioFloors';
import { StudioStorage } from '@utils/storage';

export interface StudioFloor {
	id: string;
	name: string;
}

interface StudioContextType {
	studioFloor: StudioFloor | null;
	setStudioFloor: (floor: StudioFloor | null) => void;
	studioFloors: StudioFloor[];
	isStudioTitleOpen: boolean;
	setIsStudioTitleOpen: (isOpen: boolean) => void;
	resetStudioContext: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

interface StudioProviderProps {
	children: React.ReactNode;
}

export function StudioProvider({ children }: StudioProviderProps) {
	const { data } = useGetStudioFloors();
	const [studioFloors, setStudioFloors] = useState<StudioFloor[]>([]);
	const studio_floor_storage_string = StudioStorage.getString('studio-floor') || '{}';
	const studio_floor_storage = JSON.parse(studio_floor_storage_string);
	const [studioFloor, setStudioFloor] = useState<StudioFloor | null>(studio_floor_storage);
	const [isStudioTitleOpen, setIsStudioTitleOpen] = useState(false);

	useEffect(() => {
		if (data?.length) {
			const floors: StudioFloor[] = data?.map(([id, name]: [string, string]) => ({ id, name }));
			setStudioFloors(floors);
			if (floors.length > 0 && !studioFloor) {
				StudioStorage.set('studio-floor', JSON.stringify(floors[0]));
				setStudioFloor(floors[0]);
			}
		}
	}, [data, studioFloor]);

	const resetStudioContext = () => {
		setStudioFloors([]);
		setStudioFloor(null);
		setIsStudioTitleOpen(false);
	};

	function setCurrentStudioFloor(value: { id: UniqueId; name: string }) {
		StudioStorage.set('studio-floor', JSON.stringify(value));
		setStudioFloor(value);
	}

	const value = useMemo(
		() => ({
			studioFloor,
			setStudioFloor: setCurrentStudioFloor,
			studioFloors,
			isStudioTitleOpen,
			setIsStudioTitleOpen,
			resetStudioContext,
		}),
		[studioFloor, studioFloors, isStudioTitleOpen],
	);

	return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudioContext(): StudioContextType {
	const context = useContext(StudioContext);
	if (context === undefined) {
		throw new Error('useStudioContext must be used within a StudioProvider');
	}
	return context;
}
