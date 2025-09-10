import React, { useState, useRef } from 'react';
import { Image, TouchableOpacity, View, Modal, Text as RnText } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { Tag, TagTypes, Text } from '@touchblack/ui';
import { Archive, Delete, Menu, Person } from '@touchblack/icons';

import ITalentSearch from '@models/dtos/ITalentSearch';
import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import ContentRow from './ContentRow';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

interface ITalentThumbnailCardProps {
	item: ITalentSearch | IBlackBookProfile;
	lastItem?: boolean;
	fromArchivedBlackBook?: boolean;
	onArchive?: (id: string) => void;
}

function TalentThumbnailCard({ item, lastItem, fromArchivedBlackBook, onArchive }: ITalentThumbnailCardProps) {
	/* This component takes in a talent or blackbook profile and displays it in a card */
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const menuButtonRef = useRef<TouchableOpacity>(null);
	const handleCardPress = () => {
		if ('first_name' in item) {
			navigation.navigate('TalentProfile', { id: item.id });
		} else if ('bookmark_name' in item && !fromArchivedBlackBook) {
			navigation.navigate('BlackBookProfile', { item: item });
		}
	};

	const handleDotsPress = () => {
		if (menuButtonRef.current) {
			menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
				setMenuPosition({
					x: pageX - 80,
					y: pageY + height + 5,
				});
				setModalVisible(true);
			});
		}
	};

	const handleArchivePress = () => {
		if (onArchive) {
			onArchive(item.id);
		}
		setModalVisible(false);
	};
	const handleRemoveTalent = async (item: IBlackBookProfile) => {
		setModalVisible(false);
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.RemoveMyFavorites,
				data: {
					item,
				},
			},
		});
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	function leftContent(item: ITalentSearch | IBlackBookProfile) {
		if ('first_name' in item) {
			return (
				<View>
					<Text size="bodyBig" numberOfLines={1} color="regular">
						{item.first_name}
					</Text>
					<Text size="bodyMid" color="muted">
						{item.profession_type}
					</Text>
				</View>
			);
		} else if ('bookmark_name' in item) {
			return (
				<View style={styles.bookmarkNameContainer}>
					<Text size="bodyBig" numberOfLines={1} color="regular">
						{item.bookmark_name}
					</Text>
					<Text size="bodyMid" color="muted">
						{item.profession_type || item.bookmark_profession_name} {item.rating ? `| ${item.rating}` : ''}
					</Text>
				</View>
			);
		}
		return null;
	}

	function rightContent(item: ITalentSearch | IBlackBookProfile) {
		return (
			<View style={styles.rightContentContainer}>
				{/* {'bookmark_name' in item && item.connection_level && <Tag type={'white' as TagTypes} label={item.connection_level} />} */}
				<TouchableOpacity ref={menuButtonRef} onPress={handleDotsPress} style={styles.dotsButton}>
					<Menu size="25" />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<>
			<TouchableOpacity activeOpacity={'first_name' in item ? 0.8 : 1} onPress={handleCardPress} style={styles.listItemContainer(lastItem)}>
				<View style={styles.separatorView} />
				<View style={styles.imageContainer}>
					{item.profile_picture_url ? (
						<Image
							style={styles.listImage}
							source={{
								uri: createAbsoluteImageUri(item.profile_picture_url),
							}}
						/>
					) : (
						<Person color={theme.colors.borderGray} />
					)}
				</View>
				<ContentRow customStyle={styles.talentItem} leftSideChildren={leftContent(item)} rightSideChildren={rightContent(item)} />
			</TouchableOpacity>

			<Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={handleModalClose}>
				<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleModalClose}>
					<View
						style={[
							styles.modalContent,
							{
								position: 'absolute',
								left: menuPosition.x,
								top: menuPosition.y,
							},
						]}>
						<TouchableOpacity style={styles.menuItem} onPress={handleArchivePress}>
							<View style={{ paddingRight: theme.padding.xxs }}>
								<Archive size="22" color="#83C778" />
							</View>
							<RnText style={{ color: theme.colors.success }}>{fromArchivedBlackBook ? 'Unarchive' : 'Archive'}</RnText>
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuItem} onPress={() => handleRemoveTalent(item.id)}>
							<View style={{ paddingRight: theme.padding.xxs }}>
								<Delete size="22" color="#F65F5F" />
							</View>
							<Text color="error">Remove</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</>
	);
}

export default TalentThumbnailCard;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 64,
		height: 64,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	separatorView: {
		width: 16,
	},
	listImage: {
		width: '100%',
		height: '100%',
	},
	rightContentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dotsButton: {
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 25,
		minHeight: 25,
		padding: theme.padding.xxs,
	},
	talentItem: {
		width: 'auto',
		flexGrow: 1,
		backgroundColor: theme.colors.black,
	},
	listItemContainer: (lastItem: boolean) => ({
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: lastItem ? theme.borderWidth.slim : 0,
	}),
	bookmarkNameContainer: {
		gap: 2,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: 'auto',
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingVertical: 5,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	line: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		height: 1,
	},
	menuItem: {
		paddingRight: theme.padding.base * 2,
		paddingVertical: 5,
		paddingLeft: theme.padding.sm,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));
