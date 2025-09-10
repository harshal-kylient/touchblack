import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

export default function useGSTListLogic(role: string) {
	const navigation = useNavigation();
	const [selectedGSTIN, setSelectedGSTIN] = useState<string | null>(null);

	const handleDeleteGST = useCallback((id: string) => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.DeleteGST,
				data: {
					gst_id: id,
					role: role,
				},
			},
		}).then(result => {
			if (result === 'deleted') {
				setSelectedGSTIN(null);
			}
		});
	}, []);

	const handleAddGST = useCallback(() => {
		navigation.navigate('GSTDetails', {
			role: role === 'managerTalent' ? 'managerTalent' : undefined,
		});
	}, [navigation, role]);

	const handleUpdateGST = useCallback(() => {
		navigation.navigate('GSTDetails', {
			id: selectedGSTIN,
			...(role === 'managerTalent' && { role: 'managerTalent' }),
		});
		setSelectedGSTIN('');
	}, [navigation, selectedGSTIN, role]);

	const handleSelectGST = useCallback((id: string) => {
		setSelectedGSTIN(prevId => (prevId === id ? null : id));
	}, []);

	return {
		handleDeleteGST,
		handleAddGST,
		handleUpdateGST,
		handleSelectGST,
		selectedGSTIN,
	};
}
