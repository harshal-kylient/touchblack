import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Text } from '@touchblack/ui';
import { SheetType } from 'sheets';
import { useUnlikeBlackBookFilms } from '@network/useUnlikeBlackBookFilms';

interface UnlikeFilmProps {
	film_ids: UniqueId[];
	film_name: string;
	blackbook_id: UniqueId;
}

export default function UnlikeFilm({ film_ids, film_name, blackbook_id }: UnlikeFilmProps) {
	const { styles } = useStyles(stylesheet);
	const unlikeMutation = useUnlikeBlackBookFilms();

	const handleUnlikeFilmPress = () => {
		unlikeMutation.mutate({ blackbook_id, film_ids, film_name });
	};

	const handleCancelPress = () => {
		SheetManager.hide('Drawer', {
			payload: { sheet: SheetType.UnlikeFilm },
		});
	};

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Unlike Film
				</Text>
				<Text size="primarySm" color="regular" style={styles.description}>
					Are you sure you want to remove it from liked films?
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button textColor="regular" type="secondary" style={styles.buttonCancel} onPress={handleCancelPress}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={handleUnlikeFilmPress}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	contentContainer: {
		margin: theme.margins.lg,
		gap: theme.gap.base,
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		alignSelf: 'center',
	},
	description: {
		opacity: 0.5,
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.muted,
		padding: theme.padding.lg,
	},
}));
