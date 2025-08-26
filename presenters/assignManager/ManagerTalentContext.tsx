import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import useGetManagerTalents from '@network/useGetManagerTalents';
import { TalentManagerStorage } from '@utils/storage';

const setObject = (key: string, value: unknown) => {
	TalentManagerStorage.set(key, JSON.stringify(value));
};

const getObject = <T,>(key: string): T | null => {
	const jsonValue = TalentManagerStorage.getString(key);

	if (!jsonValue || jsonValue.trim() === '') return null;

	try {
		return JSON.parse(jsonValue) as T;
	} catch (error) {
		return null;
	}
};

interface Talent {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	mobile_number: string;
	profile_picture_url: string | null;
	talent_role: string;
	user_id: string;
}

interface TalentContextType {
	selectedTalent: Talent | null;
	setSelectedTalent: (talent: Talent) => void;
	setSelectedTalentId: (id: string | null) => void;
	talentList: Talent[];
	setTalentList: (list: Talent[]) => void;
	refreshTalents: () => void;
	resetTalentContext: () => void;
	setObject: (string: string, talent: Talent) => void;
	isTalentDropdownOpen: boolean;
	setIsTalentDropdownOpen: (open: boolean) => void;
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

interface TalentProviderProps {
	children: React.ReactNode;
}

export function ManagerTalentProvider({ children }: TalentProviderProps) {
	const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
	const [selectedTalentId, setSelectedTalentIdState] = useState<string | null>(null);
	const [talentList, setTalentList] = useState<Talent[]>([]);
	const [isTalentDropdownOpen, setIsTalentDropdownOpen] = useState(false);
	const { data: managerTalents, mutate: refetchTalents } = useGetManagerTalents('active');

	useEffect(() => {
		const TALENT_LIST = managerTalents?.data?.manager_talents;
		setTalentList(TALENT_LIST);
		const storedTalent = getObject<Talent>('selected-talent');
		if (storedTalent) {
			setSelectedTalent(storedTalent);
			setSelectedTalentIdState(storedTalent.id);
			return;
		}
		if (TALENT_LIST?.length > 0) {
			const first = TALENT_LIST[0];
			setSelectedTalent(first);
			setSelectedTalentIdState(first.id);
			setObject('selected-talent', first);
		}
	}, [managerTalents]);

	useEffect(() => {
		if (!talentList?.length) {
			// No talents available
			TalentManagerStorage.delete('selected-talent');
			setSelectedTalent(null);
			setSelectedTalentIdState(null);
			return;
		}

		const currentSelected = talentList.find(t => t.id === selectedTalentId);

		if (currentSelected) {
			// Valid selection still exists
			setSelectedTalent(currentSelected);
			setObject('selected-talent', currentSelected);
		} else {
			// Previously selected talent no longer exists, select the first
			const fallbackTalent = talentList[0];
			setSelectedTalent(fallbackTalent);
			setSelectedTalentIdState(fallbackTalent.id);
			setObject('selected-talent', fallbackTalent);
		}
	}, [talentList, selectedTalentId]);

	const setSelectedTalentId = (id: string | null) => {
		setSelectedTalentIdState(id);
	};
	const refreshTalents = async () => {
		try {
			const response = await refetchTalents();
			const list = response?.data?.manager_talents ?? [];
			setTalentList(list);

			if (list.length > 0) {
				const first = list[0];
				setSelectedTalent(first);
				setSelectedTalentIdState(first.id);
				setObject('selected-talent', first);
			}
		} catch (err) {
			console.error('Failed to refresh talents:', err);
		}
	};

	const resetTalentContext = () => {
		TalentManagerStorage.delete('selected-talent');
		setSelectedTalentIdState(null);
		setSelectedTalent(null);
		setTalentList([]);
	};

	const value = useMemo(
		() => ({
			selectedTalent,
			setSelectedTalent,
			setSelectedTalentId,
			talentList,
			setObject,
			setTalentList,
			refreshTalents,
			isTalentDropdownOpen,
			setIsTalentDropdownOpen,
			resetTalentContext,
		}),
		[selectedTalent, talentList, isTalentDropdownOpen],
	);

	return <TalentContext.Provider value={value}>{children}</TalentContext.Provider>;
}

export function useTalentContext(): TalentContextType {
	const context = useContext(TalentContext);
	if (!context) {
		throw new Error('useTalentContext must be used within a ManagerTalentProvider');
	}
	return context;
}
