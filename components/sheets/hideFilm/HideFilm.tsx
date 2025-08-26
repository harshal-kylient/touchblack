import CONSTANTS from '@constants/constants';
import IFilm from '@models/entities/IFilm';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { useAuth } from '@presenters/auth/AuthContext';
import { Button, Text } from '@touchblack/ui';
import server from '@utils/axios';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetType } from 'sheets';

interface IProps {
	film: IFilm;
	type: FilmOptionsEnum;
	onSuccess?: () => void;
}

export default function HideFilm({ film, type, onSuccess }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	async function handleHideFilm() {
		const endpoint = type === FilmOptionsEnum.ProducerFilms ? CONSTANTS.endpoints.hide_producer_film : CONSTANTS.endpoints.hide_showreel;
		const response = await server.post(endpoint, { film_id: film?.film_id, is_private: !film.is_private });
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: { header: 'Success', text: response.data.message, onPress: onSuccess },
				},
			});
		} else {
			setServerError(response.data?.message || 'Something wrong happened, Please try later.');
		}
	}

	return (
		<View>
			<Text numberOfLines={1} size="primaryMid" color="regular" style={[styles.textCenter, { paddingTop: theme.padding.base, paddingHorizontal: theme.padding.base }]}>
				{film?.film_name}
			</Text>
			<Text size="button" color="muted" style={[styles.textCenter, { paddingBottom: theme.padding.base, paddingTop:theme.padding.xs }]}>
				Are you sure, you want to {film.is_private ? 'unhide' : 'hide'} this film?
			</Text>
			{serverError ? (
				<Text size="bodyMid" color="error">
					{serverError}
				</Text>
			) : null}
			<View style={styles.footer}>
				<Button
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.HideFilm },
						})
					}
					type="secondary"
					textColor="regular"
					style={styles.widthHalf}>
					Cancel
				</Button>
				<Button onPress={handleHideFilm} type="primary" textColor="black" style={styles.widthHalf}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {},
	paddingBase: {
		paddingHorizontal: theme.padding.sm,
		paddingVertical: theme.padding.sm,
	},
	paddingXxs: {
		paddingHorizontal: theme.padding.xxs,
		paddingVertical: theme.padding.xxs,
	},
	textCenter: {
		textAlign: 'center',
	},
	widthHalf: {
		width: '50%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		paddingBottom: Platform.OS === 'android' ? theme.padding.base * 2 : 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialog: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
