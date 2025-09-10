import CONSTANTS from '@constants/constants';
import IFilm from '@models/entities/IFilm';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Hide, Pencil, Pin, PinFilled } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import server from '@utils/axios';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetType } from 'sheets';

interface IProps {
	film: IFilm;
	type: FilmOptionsEnum;
	onSuccess?: () => void;
}

export default function FilmOptions({ film, type, onSuccess }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const { loginType, managerTalentId } = useAuth();
	const queryClient = useQueryClient();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	async function handlePinFilm() {
		const endpoint = type === FilmOptionsEnum.ProducerFilms ? CONSTANTS.endpoints.pin_producer_film : CONSTANTS.endpoints.pin_showreel 
		const response = await server.post(endpoint, { film_id: film?.film_id, pinned: !film?.is_pinned, is_pinned: !film?.is_pinned });
		if (response.data?.success) {
			queryClient.invalidateQueries(['useGetOtherWorks']);
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

	function handleEditFilm() {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.EditFilm,
				data: { type, film, onSuccess },
			},
		});
	}

	function handleHideFilm() {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.HideFilm,
				data: { film, type, onSuccess },
			},
		});
	}

	return (
		<View style={styles.container}>
			<Pressable onPress={handlePinFilm} style={{ flexDirection: 'row', gap: theme.gap.xs }}>
				{film?.is_pinned ? <Pin size="24" /> : <PinFilled size="24" />}
				<Text size="button" color="muted">
					{film?.is_pinned ? 'Unpin Film from top' : 'Pin Film to top'}
				</Text>
			</Pressable>
			{!film?.is_verified ? (
				<Pressable onPress={handleEditFilm} style={{ flexDirection: 'row', gap: theme.gap.xs }}>
					<Pencil size="24" />
					<Text size="button" color="muted">
						Edit Film
					</Text>
				</Pressable>
			) : null}
			<Pressable onPress={handleHideFilm} style={{ flexDirection: 'row', gap: theme.gap.xs }}>
				<Hide size="24" />
				<Text size="button" color="muted">
					{film?.is_private ? 'Unhide Film' : 'Hide Film'}
				</Text>
			</Pressable>
			{serverError ? (
				<Text size="bodyMid" color="error">
					{serverError}
				</Text>
			) : null}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		padding: theme.padding.base*1.5,
		gap: theme.gap.xs,
		
	},
}));
