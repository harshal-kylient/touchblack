import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import CONSTANTS from '@constants/constants';
import { useGetSubscriptionRestrictions } from '@network/useGetSubscriptionRestrictions';

interface SubscriptionContextType {
	subscriptionData: Record<string, any>;
	isLoading: boolean;
	refreshRestrictions: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [subscriptionData, setSubscriptionData] = useState<Record<string, any>>({});
	const [isLoading, setIsLoading] = useState(true);
	const screenIds = [
		CONSTANTS.POPUP_TYPES.SEARCH,
		CONSTANTS.POPUP_TYPES.CALENDAR,
		CONSTANTS.POPUP_TYPES.MAILBOX_PROJECTS_CHATS,
		CONSTANTS.POPUP_TYPES.PROJECT,
		CONSTANTS.POPUP_TYPES.PROFILE_ADD_FILM,
		CONSTANTS.POPUP_TYPES.PROFILE_VIEW_FILM,
		CONSTANTS.POPUP_TYPES.PROFILE_ADD_OTHER_FILM,
		CONSTANTS.POPUP_TYPES.PROFILE_SELF_SHARE,
		CONSTANTS.POPUP_TYPES.PROFILE_OTHER_SHARE,
		CONSTANTS.POPUP_TYPES.CLAIM_ACCOUNT,
		CONSTANTS.POPUP_TYPES.NOTIFICATIONS,
		CONSTANTS.POPUP_TYPES.SHOWREEL_MANAGEMENT,
		CONSTANTS.POPUP_TYPES.ASSIGN_MANAGER,
		CONSTANTS.POPUP_TYPES.CHANGE_MANAGER,
		CONSTANTS.POPUP_TYPES.ASSIGN_MANAGER,
		CONSTANTS.POPUP_TYPES.CHANGE_MANAGER,
	];
	const { mutateAsync } = useGetSubscriptionRestrictions();

	const fetchRestrictions = useCallback(async () => {
		try {
			setIsLoading(true);
			const restrictions: Record<string, any> = {};
			for (const screenId of screenIds) {
				const data = await mutateAsync(screenId);
				restrictions[screenId] = data;
			}
			setSubscriptionData(restrictions);
		} catch (error) {
			console.error('Failed to fetch restrictions', error);
		} finally {
			setIsLoading(false);
		}
	}, [mutateAsync]);

	useEffect(() => {
		fetchRestrictions();
	}, [fetchRestrictions]);

	return <SubscriptionContext.Provider value={{ subscriptionData, isLoading, refreshRestrictions: fetchRestrictions }}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
	const context = useContext(SubscriptionContext);
	if (!context) {
		throw new Error('useSubscription must be used within a SubscriptionProvider');
	}
	return context;
};
