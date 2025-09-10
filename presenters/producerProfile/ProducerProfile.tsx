import { useEffect, useRef, useState } from 'react';
import { View, StatusBar, Animated, LayoutChangeEvent, Platform, Pressable, SafeAreaView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useSWR from 'swr';

import { useAuth } from '@presenters/auth/AuthContext';
import ProfilePlaceholder from '@components/loaders/ProfilePlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import CONSTANTS from '@constants/constants';
import fetcher from '@utils/fetcher';
import { IMainStackParams } from '..';
import ProducerProfileHeader from './screenComponents/ProducerProfileHeader';
import SearchedProducerProfileHeader from './screenComponents/SearchedProducerProfileHeader';
import ProfileHeader from '@components/ProfileHeader';
import Header from '@components/Header';
import Films from './Tabs/Films';
import BusinessDetails from './Tabs/BusinessDetails';
import Team from './Tabs/Team';
import { Button, Text } from '@touchblack/ui';
import useGetTeamMembers from '@network/useGetTeamMembers';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useNavigation } from '@react-navigation/native';
import { useFilterContext } from './Tabs/FilterContext';

interface IProps extends NativeStackScreenProps<IMainStackParams, 'ProducerProfile'> {}

function ProducerProfile({ route }: IProps) {
	const { producerId: myProducerId, userId, businessOwnerId, permissions } = useAuth();
	const producerId = route.params?.id || myProducerId;
	const { styles, theme } = useStyles(stylesheet);
	const contentHeight = useRef<number>(0);
	const screenHeight = useRef<number>(0);
	const [activeTab, setActiveTab] = useState(0);
	const { refetch: mutateTeamMembers } = useGetTeamMembers(producerId);
	const { refetch: mutateAbout } = useGetUserDetailsById('Producer', producerId);
	const { dispatch } = useFilterContext();
	const navigation = useNavigation();
	const [paddingBottom, setPaddingBottom] = useState(0);

	const myprofile = producerId === myProducerId;
	const { data: producerData, isLoading } = useSWR(CONSTANTS.endpoints.producer_about(producerId!), fetcher);

	useEffect(() => {
		return () => dispatch({ type: 'RESET_FILTERS' });
	}, [dispatch]);

	if (isLoading) {
		return (
			<View style={styles.loader}>
				<ProfilePlaceholder />
				<TabsPlaceholder />
				<SearchBarPlaceholder />
				<LargeGridPlaceholder />
				<LargeGridPlaceholder />
				<TextPlaceholder customWidth={UnistylesRuntime.screen.width - 32} customHeight={48} />
			</View>
		);
	}

	const handleContentSizeChange = (height: number) => {
		contentHeight.current = height;
	};
	

	const handleLayout = (event: LayoutChangeEvent) => {
		const { height } = event.nativeEvent.layout;
		screenHeight.current = height;
	};

	const UpdateProducerProfile = () => {
		navigation.navigate('UpdateProducerProfile');
	};

	const addTeamMemberDrawer = () => {
		navigation.navigate('ProducerTeamMembers');
	};

	const handleAddFilm = () => {
		navigation.navigate('AddFilm', { type: 'producer', onSuccess: mutateTeamMembers });
	};

	return (
		<SafeAreaView style={styles.screenContainer} onLayout={handleLayout}>
			<View style={{flex:1}}>
				<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
				<Header name="Profile">
					<ProfileHeader id={producerId} type="Producer" />
				</Header>
				{myprofile ? <ProducerProfileHeader onSuccess={mutateAbout}  producerId={producerId} /> : <SearchedProducerProfileHeader  producerId={producerId} />}
				<View style={{ paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Pressable onPress={() => setActiveTab(0)} style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
							Films
						</Text>
						<View style={styles.absoluteContainer(activeTab === 0)} />
					</Pressable>
					<Pressable onPress={() => setActiveTab(1)} style={{ flex: activeTab == 1 ? 3 : 2, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
							Business Info
						</Text>
						<View style={styles.absoluteContainer(activeTab === 1)} />
					</Pressable>
					<Pressable onPress={() => setActiveTab(2)} style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 2 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 2 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 2 ? 'primary' : 'regular'}>
							Team
						</Text>
						<View style={styles.absoluteContainer(activeTab === 2)} />
					</Pressable>
				</View>
				{activeTab === 0 ? <Films paddingBottom={paddingBottom} producerId={producerId} /> : activeTab === 1 ? <BusinessDetails paddingBottom={paddingBottom} producerId={producerId} /> : <Team paddingBottom={paddingBottom} searchProducerId={producerId} myprofile={myprofile} />}
			</View>
			{myprofile ? (
				<View onLayout={event => setPaddingBottom(event.nativeEvent.layout.height)} style={styles.buttonContainer}>
					{activeTab === 0 && permissions?.includes('Profile::Edit') ? (
						<Button onPress={handleAddFilm} textColor="black" type="primary" style={styles.button}>
							Add New Film
						</Button>
					) : null}
					{activeTab === 1 && userId === businessOwnerId ? (
						<Button onPress={UpdateProducerProfile} textColor="primary" type="secondary" style={styles.button}>
							Edit
						</Button>
					) : null}
					{activeTab === 2 && userId === businessOwnerId ? (
						<Button onPress={addTeamMemberDrawer} textColor="black" type="primary" style={styles.button}>
							Add Team Member
						</Button>
					) : null}
				</View>
			) : null}
		</SafeAreaView>
	);
}

export default ProducerProfile;

const stylesheet = createStyleSheet(theme => ({
	screenContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	loader: {
		backgroundColor: theme.colors.black,
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	buttonContainer: {
		position: 'absolute',
		flexDirection: 'row',
		bottom: 0,
		flex: 1,
		backgroundColor: theme.colors.black,
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	},
	button: {
		flexGrow: 1,
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
}));
