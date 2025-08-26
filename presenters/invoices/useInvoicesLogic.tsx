import { useNavigation } from '@react-navigation/native';
import { useInvoicesContext } from './context/InvoicesContext';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

export default function useInvoicesLogic() {
	const { state, dispatch } = useInvoicesContext();
	const navigation = useNavigation();
	// const showFooter = state.selectedProject !== null && state.selectedInvoices.length > 0;
	const showFooter = false;

	const handleFilterPress = () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.SortInvoices,
			},
		});
	};

	const handleUploadPOP = () => {
		navigation.navigate('UploadPOP');
	};

	const handleReset = () => {
		dispatch({ type: 'RESET' });
	};

	return {
		handleFilterPress,
		handleUploadPOP,
		handleReset,
		state,
		showFooter,
	};
}
