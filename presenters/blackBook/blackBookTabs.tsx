// blackBookTabs.ts
import { IBlackBookTabs } from '@models/entities/IBlackBookTabs';

export const createTabs = (blackBookLength: number, activeTab: string): IBlackBookTabs[] => {
	return [
		{ label: `All${activeTab === 'All' ? ` (${blackBookLength})` : ''}`, data: blackBookLength, id: 1, isActive: activeTab === 'All', identifier: 'All' },
		{ label: `High${activeTab === 'High' ? ` (${blackBookLength})` : ''}`, data: blackBookLength, id: 2, isActive: activeTab === 'High', identifier: 'High' },
		{ label: `Medium${activeTab === 'Medium' ? ` (${blackBookLength})` : ''}`, data: blackBookLength, id: 3, isActive: activeTab === 'Medium', identifier: 'Medium' },
		{ label: `Low${activeTab === 'Low' ? ` (${blackBookLength})` : ''}`, data: blackBookLength, id: 4, isActive: activeTab === 'Low', identifier: 'Low' },
	];
};
