import { NativeSyntheticEvent, StyleProp, TextInputChangeEventData, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Search } from '@touchblack/icons';
import { TextInput } from '@touchblack/ui';

interface ISearchInputProps {
	placeholderText?: string;
	searchQuery?: string;
	setSearchQuery?: any;
	containerStyles?: StyleProp<ViewStyle>;
	onPress?: () => void;
	autoFocus?: boolean;
	searchIconOffset?: boolean;
	editable?: boolean;
}

function SearchInput({ searchQuery, setSearchQuery, placeholderText = 'Search for...', containerStyles, onPress, autoFocus, searchIconOffset = true, editable = true, ...props }: ISearchInputProps) {
	const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		const text = e.nativeEvent.text;
		if (setSearchQuery) {
			setSearchQuery(text);
		}
	};
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={[styles.searchInputContainer, containerStyles]} {...props}>
			<Search style={styles.searchIcon(searchIconOffset)} color="white" size="22" />
			<TextInput editable={editable} onPressIn={onPress} autoFocus={autoFocus} value={searchQuery ? searchQuery : ''} onChange={handleInputChange} style={styles.textInput} placeholderTextColor={theme.colors.borderGray} placeholder={placeholderText} />
		</View>
	);
}

export default SearchInput;

const stylesheet = createStyleSheet(theme => ({
	searchInputContainer: {
		marginVertical: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		position: 'relative',
		justifyContent: 'center',
	},
	textInput: {
		fontSize: theme.fontSize.button,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingLeft: 44,
		backgroundColor: theme.colors.black,
	},
	searchIcon: (searchIconOffset: boolean) => ({
		position: 'absolute',
		zIndex: 99,
		height: '100%',
		width: 56,
		left: searchIconOffset ? theme.padding.base + (2 / 3) * theme.padding.base : theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	}),
}));
