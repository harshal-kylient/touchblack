import { useRef, useEffect, useState } from 'react';
import { Pressable, ScrollView, LayoutChangeEvent, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import useGetBlackBookProfessions from '@network/useGetBlackBookProfessions';
import IProfessionDto from '@models/dtos/IProfessionDto';

interface IProps {
	profession_id: string;
	setProfessionId: (profession_id: string) => void;
}

export default function BlackbookProfessionsList({ profession_id, setProfessionId }: IProps) {
	const { data, isLoading, error } = useGetBlackBookProfessions();
	const professions = data?.formattedProfessions || [];
	const { styles, theme } = useStyles(stylesheet);
	const scrollViewRef = useRef<ScrollView>(null);
	const [itemLayouts, setItemLayouts] = useState<{ [key: string]: number }>({});

	useEffect(() => {
		if (scrollViewRef.current && professions.length > 0 && Object.keys(itemLayouts).length === professions.length) {
			const activeIndex = professions.findIndex(profession => profession.id === profession_id);
			if (activeIndex !== -1) {
				const scrollToX = professions.slice(0, activeIndex).reduce((sum, profession) => sum + (itemLayouts[profession.id] || 0), 0);
				scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
			}
		}
	}, [profession_id, professions, itemLayouts]);

	if (!professions.length || isLoading || error) {
		return <View />;
	}

	return (
		<ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} style={styles.professionsListContainer} contentContainerStyle={{ paddingHorizontal: theme.padding.base }}>
			{professions.map((it: IProfessionDto, index: number) => (
				<ListItem
					key={it.id}
					active={it.id === profession_id}
					text={it.name}
					profession_id={it.id}
					setProfessionId={setProfessionId}
					onLayout={(event: LayoutChangeEvent) => {
						const { width } = event.nativeEvent.layout;
						if (width > 0) {
							setItemLayouts(prev => ({
								...prev,
								[it.id]: width,
							}));
						}
					}}
				/>
			))}
		</ScrollView>
	);
}

interface IListItemProps {
	text: string;
	active: boolean;
	profession_id: string;
	setProfessionId: (profession_id: string) => void;
	onLayout: (event: LayoutChangeEvent) => void;
}

function ListItem({ text, active, profession_id, setProfessionId, onLayout }: IListItemProps) {
	const { theme } = useStyles();

	return (
		<Pressable
			style={{
				backgroundColor: active ? theme.colors.black : theme.colors.backgroundLightBlack,
				padding: theme.padding.sm,
				borderLeftWidth: theme.borderWidth.slim,
				borderColor: theme.colors.borderGray,
			}}
			onPress={() => setProfessionId(profession_id)}
			onLayout={onLayout}>
			<Text size="bodyMid" color={active ? 'primary' : 'regular'} textAlign="center">
				{text}
			</Text>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	professionsListContainer: {
		flexDirection: 'row',
		maxHeight: 44,
		marginTop: theme.margins.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
