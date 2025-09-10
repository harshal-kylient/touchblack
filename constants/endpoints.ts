import IListData from '@models/dtos/IListData';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import EnumStatus from '@models/enums/EnumStatus';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import SearchParamEnum from '@models/enums/SearchParamEnum';

const endpoints = {
	// sessions/auth
	register_device: 'devices/capture_device',
	signin: 'sessions/signin',
	signup: 'sessions/signup',
	authenticate: 'sessions/authenticate',
	delete_account: 'sessions/delete_account',
	switch_profile: (login_type: 'producer' | 'talent') => `sessions/switch_profile?login_type=${login_type}`,
	signout: (deviceId: string) => `sessions/signout?unique_device_id=${deviceId}`,

	// search
	search: (master_type: string, searchQuery: string, page: number = 1, filters?: string) => `search/${master_type}?${searchQuery ? 'q=' + searchQuery : ''}&${filters ? filters : ''}&page=${page}`,
	searchFilter: (master_type: string, paramKey: string, paramValue: string, searchQuery: string) => `search/${master_type}?${paramKey}=${paramValue}${searchQuery ? '&q=' + searchQuery : ''}`,
	brand_search: (query: string, page?: number) => `search/blackenum?black_enum_type=brand&q=${query}&page=${page}`,
	searchOtherWorks: (ownerId: UniqueId, query?: string, page?: number) => `search/talent_film?q=${query || ''}&owner_id=${ownerId}&page=${page}`,
	search_for_blackbook_by_owner_id: (ownerId: string | null | undefined, page: number = 1, query?: string, rating?: string) => (rating?.includes('All') ? `search/blackbook?owner_id=${ownerId}&page=${page}&q=${query}` : `search/blackbook?q=${query}&rating=${rating}&owner_id=${ownerId}&page=${page}`),
	all_users: (query: string = '', page: number = 1) => `search/talent_prod?${query ? 'q=' + query : ''}&page=${page}`,
	project_talents: (query: string, profession_type: string, dates: string[], page: number = 1) => `search/user?${query ? 'q=' + query : ''}&profession_type=${profession_type}&dates=[${dates}]&page=${page}`,
	get_blackbook_data: (query: string, page: number, perPageData: number = 10) => `search/blackbook?${query ? 'q=' + query : ''}page=${page}&per_page=${perPageData}`,

	// utils
	populate_data: (data_type: SearchParamEnum, q: string) => `utils/populate_data?data_type=${data_type}${q ? 'q=' + q : ''}`,
	populateData: (type: IListData, q?: string) => `utils/populate_data?data_type=${type}${q ? 'q=' + q : ''}`,
	states_by_country: (countryId: string) => `utils/populate_states?country_id=${countryId}`, // send country id as country_id
	report: 'reports/create',
	populateStates: (countryId: UniqueId) => `utils/populate_states?country_id=${countryId}`,
	states: (countryId: UniqueId) => `utils/populate_states?country_id=${countryId}`,

	// aadhar verification
	aadhar_get_otp: 'aadhar/otp_get',
	aadhar_verify_otp: 'aadhar/authenticate',

	// my producer profile
	add_film: 'my_producer/film',
	update_producer_address: 'my_producer/address',
	update_producer_bio: 'my_producer/update_bio',
	create_producer_award: 'my_producer/add_award',
	update_producer_award: 'my_producer/update_award',
	remove_producer_award: 'my_producer/remove_award',
	producer_add_awards: 'my_producer/add_award',
	producer_profilepic: 'my_producer/profile_picture',
	hide_producer_film: 'my_producer/manage_archive_film',
	producer_bio_update: 'my_producer/update_bio',
	edit_producer_film: 'my_producer/film/request_edit',
	pin_producer_film: 'my_producer/manage_pin_film',

	// team management
	add_team_member: (user_id: string) => `my_producer/add_team_member?user_id=${user_id}`,
	remove_team_member: (user_id: string) => `my_producer/remove_team_member?user_id=${user_id}`,
	access_permission_list: 'manage_producer_access/access_permission_list',
	producer_access_permission_list: (user_id: string) => `my_producer/producer_access_permissions_list?user_id=${user_id}`,
	producer_access_permission_update: 'my_producer/manage_producer_access',

	// producers
	producer_about: (producer_id: string) => `producers/${producer_id}/about`,
	films: (producerId: string, page: number = 1) => `producers/${producerId}/films?page=${page}`,
	fetch_team_member: (producer_id: string, page: number = 1) => `producers/${producer_id}/fetch_team_members?page=${page}`,
	get_producer_awards: (producerId: string) => `producers/${producerId}/awards`,

	// my talent profile
	update_talent_profile: 'my_talent/update_user_profile',
	talent_profilepic: 'my_talent/profile_picture',
	create_talent_award: 'my_talent/add_award',
	update_talent_award: (talent_id: string) => `my_talent/update_award?talent_id=${talent_id}`,
	remove_talent_award: 'my_talent/remove_award',
	addShowreel: (talent_id: string) => `my_talent/showreel?talent_id=${talent_id}`,
	pin_showreel: 'my_talent/manage_pin_showreel',
	hide_showreel: 'my_talent/manage_hide_other_work',
	talent_add_awards: 'my_talent/add_award',
	edit_talent_otherwork: (talent_id: string) => `my_talent/update_showreel?talent_id=${talent_id}`,
	pin_talent_otherwork: (talent_id: string) => `my_talent/manage_pin_showreel?talent_id=${talent_id}`,
	hide_talent_otherwork: (talent_id: string) => `my_talent/manage_hide_other_work?talent_id=${talent_id}`,
	talent_all_projects: (status?: EnumStatus, page: number = 1, query?: string) => `my_talent/list_talent_projects?${status ? 'status=' + status : ''}&page=${page}${query ? '&q=' + query : ''}`,
	remove_talent_education: (instituteMappingId: UniqueId) => `my_talent/remove_institute_mapping?user_institute_mapping_id=${instituteMappingId}`,
	add_showreel_film: 'my_talent/add_talent_film_details',
	projects_count: 'my_talent/projects_count',
	know_this_person: 'my_talent/know_this_person',

	// talents
	talent_about: (talent_id: string) => `talents/${talent_id}/about`,
	showreelsOtherWorks: (talentId: string, page: number = 1) => `talents/${talentId}/showreel?page=${page}`,
	film_professions: (talentId: string, page: number = 1) => `talents/${talentId}/film_professions?page=${page}`,
	showreel: (talentId: string, page: number = 1) => `talents/${talentId}/crew_films?page=${page}`,
	claim: (talentId: UniqueId) => `talents/${talentId}/claim_talent_account`,
	talent_awards: (owner_id: string) => `talents/${owner_id}/awards`, // owner id is the user id
	fetch_showreel_without_profession_id: (talentId: string, page: number = 1) => `talents/${talentId}/crew_films?page=${page}`,
	list_data_by_date: (talentId: UniqueId, date: string) => `talent_calendar/list_data_by_date?talent_id=${talentId}&date=${date}`,

	// trending/discover
	producers_list: 'discover/producers_list',
	latest_release: (page: number = 1) => `films/latest_release?page=${page}`,
	worked_with: 'discover/worked_with',
	trending_talents: (page: number = 1) => `discover/talents?page=${page}`,
	discover_studios: (page: number = 1) => `/discover/studio_floors?page=${page}`,

	// films
	crewlist: (filmId: string, page: number = 1) => `films/${filmId}/list_film_crew?page=${page}`,
	film_details: (filmId: UniqueId) => `films/${filmId}`,

	// block, unblock
	block: 'blocks/create',
	unblock: 'blocks/delete',
	block_list: (page: number = 1) => `blocks/index?page=${page}`,

	// blackbook
	add_blackbook: 'blackbooks/add_blackbook',
	remove_from_favorites: 'blackbooks/remove_blackbook',
	fetch_blackBook_talent_professions: (page: number = 1) => `blackbooks/talent_professions?page=${page}`,
	fetch_blackbook: (profession_id: UniqueId, page: number = 1) => `blackbooks/fetch_blackbooks?profession_id=${profession_id}&page=${page}`, // ?profession_id= I am adding this via a function
	fetch_archived_blackbook: (page: number = 1) => `blackbooks/list_archived_blackbooks?page=${page}`,
	archive_blackbook: (blackbook_id: string) => `blackbooks/archive?blackbook_id=${blackbook_id}`,
	unarchive_blackbook: (blackbook_id: string) => `blackbooks/unarchive?blackbook_id=${blackbook_id}`,
	remove_blackbook_film_by_bookmark_id: 'blackbooks/remove_blackbook_film',
	get_ordered_blackbook_data: 'my_producer/blackbooks',
	search_blackbook_by_blackbook_id: (blackbook_id: UniqueId) => `blackbooks/${blackbook_id}`,

	// messages
	all_conversations: (owner_id: UniqueId, page: number = 1, project_id?: UniqueId) => `messages/list_all_conversations?owner_id=${owner_id}${project_id ? '&project_id=' + project_id : ''}&page=${page}`,
	fetch_conversation: (id: UniqueId, owner_id: UniqueId, page: number = 1, project_id?: UniqueId) => `messages/fetch_conversation?conversation_id=${id}&owner_id=${owner_id}${project_id ? '&project_id=' + project_id : ''}&page=${page}`,
	fetch_conversation_id: (party1_id: UniqueId, party2_id: UniqueId, project_id: UniqueId, conversation_type: 'project' | 'producer_studio_floor') => `messages/fetch_conversation_id?party1_id=${party1_id}&party2_id=${party2_id}&project_id=${project_id}&conversation_type=${conversation_type}`,
	send_message: (id: UniqueId, owner_id: UniqueId, content: string) => `messages/send_message?conversation_id=${id}&owner_id=${owner_id}&content=${content}`,
	mark_message_read: (owner_id: UniqueId, message_ids: string[]) => `messages/mark_messages_read?owner_id=${owner_id}&message_ids=${message_ids}`,
	create_conversation: (owner_id: UniqueId, party1_id: UniqueId, party2_id?: UniqueId, project_id?: UniqueId) => `messages/create_conversation?owner_id=${owner_id}&party1_id=${party1_id}${party2_id ? '&party2_id=' + party2_id : ''}${project_id ? '&project_id=' + project_id : ''}`,
	producer_talent_message_template: (projectId: UniqueId, talentId: UniqueId) => `messages/producer_talent_template?project_id=${projectId}&talent_id=${talentId}`,

	// notifications
	all_notifications: (page: number = 1) => `notifications/list_all_notifications?page=${page}`,
	mark_notification_read: 'notifications/mark_read',

	// projects
	producer_all_projects: (status?: EnumProducerStatus, page: number = 1, query?: string) => `projects?${status ? 'status=' + status : ''}&page=${page}${query ? '&q=' + query : ''}`,
	project: 'projects',
	project_details: (projectId: UniqueId) => `projects/${projectId}`,
	producer_calendar: (year_month: string) => `producer_calendar?year_month=${year_month}`,
	/* dateString in YYYY-MM-DD format */
	list_producer_projects_by_day: (dateString: string) => `producer_calendar/list_projects?date=${dateString}`,

	talent_calendar: (talent_id: UniqueId, year_month: string) => `talent_calendar?talent_id=${talent_id}&year_month=${year_month}`,
	block_talent_dates: (start_date: string, end_date: string, start_time: string, end_time: string, notes: string, title?: string, reason?: string, status?: EnumStatus) => `talent_calendar/block_calendar_dates?start_date=${start_date}&end_date=${end_date}&start_time=${start_time}&end_time=${end_time}&notes=${notes}${title ? '&title=' + title : ''}${reason ? '&blocked_reason_type=' + reason : ''}${status ? '&blocked_project_status=' + status : ''}`,
	list_talent_blocked_dates: (year: string) => `talent_calendar/list_blocked_dates?year=${year}`,
	/* every date in YYYY-MM-DD format */
	update_talent_blocked_dates: (old_start_date: string, old_end_date: string, old_start_time: string, old_end_time: string, new_start_date: string, new_end_date: string, new_start_time: string, new_end_time: string, notes?: string, title?: string, reason?: string, status?: EnumStatus) =>
		`talent_calendar/update_blocked_dates?old_start_date=${old_start_date}&old_end_date=${old_end_date}&old_start_time=${old_start_time}&old_end_time=${old_end_time}&new_start_date=${new_start_date}&new_end_date=${new_end_date}&new_start_time=${new_start_time}&new_end_time=${new_end_time}&notes=${notes}${title ? '&title=' + title : ''}${reason ? '&blocked_reason_type=' + reason : ''}${status ? '&blocked_project_status=' + status : ''}`,
	delete_talent_blocked_dates: (start_date: string, end_date: string, start_time: string, end_time: string, title: string, reason: string) => `talent_calendar/delete_blocked_dates?start_date=${start_date}&end_date=${end_date}&start_time=${start_time}&end_time=${end_time}${title ? '&title=' + title : ''}${reason ? '&blocked_reason_type=' + reason : ''}`,

	// project invitations
	project_invitations: 'project_invitations',
	get_project_invitations: (projectId: UniqueId, professionId?: UniqueId, status?: EnumStatus, page: number = 1) => `project_invitations?project_id=${projectId}${professionId ? '&profession_id=' + professionId : ''}${status ? '&status=' + status : ''}&page=${page}`,
	project_professions: (projectId: UniqueId, status?: EnumStatus) => `project_invitations/list_professions?project_id=${projectId}${status ? '&status=' + status : ''}`,
	project_invitation_dates: (projectId: UniqueId, professionId: UniqueId) => `project_invitations/list_invitation_dates_by_profession?project_id=${projectId}&profession_id=${professionId}`,
	update_project_dates: 'project_invitations/update_invitation_dates',
	negotiations: 'negotiations',
	gst_details: 'gst_details',
	get_all_active_gst: 'gst_details?status=active',
	gst_detail: (id: string) => `gst_details/${id}`,

	// project negotiations
	opt_out: (invitation_id: UniqueId, conversation_id: UniqueId, status: EnumStatus) => `project_invitations/update_invitation_status?status=${status}&project_invitation_id=${invitation_id}&conversation_id=${conversation_id}`,
	initiate_negotiation: 'negotiations',
	list_negotiations: (conversation_id: UniqueId) => `negotiations?conversation_id=${conversation_id}`,
	counter_offer: (negotiation_id: UniqueId, amount: number) => `negotiations/${negotiation_id}/counter_offer?negotation_id=${negotiation_id}&amount=${amount}`,
	confirm_offer: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/confirm_offer?negotiation_id=${negotiation_id}`,
	fetch_project_deal: (talent_id: UniqueId, project_id: UniqueId, producer_id: UniqueId) => `negotiations/fetch_deal?talent_id=${talent_id}&project_id=${project_id}&producer_id=${producer_id}`,
	raise_claim: 'negotiations/raise_claim',
	revise_claim: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/revise_claim`,
	accept_claim: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/accept_claim`,

	// user identity proof
	fetch_user_identity_proof_by_type: (user_id: string, proof_type: string) => `users/${user_id}/user_identity_proofs/fetch_by_type?proof_type=${proof_type}`,
	create_user_identity_proof: (user_id: string) => `users/${user_id}/user_identity_proofs`,
	update_user_identity_proof: (user_id: string, proof_id: string) => `users/${user_id}/user_identity_proofs/${proof_id}`,

	// bank details
	list_bank_details: (userId: string) => `users/${userId}/bank_details`,
	create_bank_detail: (userId: string) => `users/${userId}/bank_details`,
	get_bank_detail: (userId: string, bankDetailId: string) => `users/${userId}/bank_details/${bankDetailId}`,
	update_bank_detail: (userId: string, bankDetailId: string) => `users/${userId}/bank_details/${bankDetailId}`,
	delete_bank_detail: (userId: string, bankDetailId: string) => `users/${userId}/bank_details/${bankDetailId}`,
	search_bank_ifsc: 'search/bank_ifsc',

	// invoices
	get_invoices: (owner_type: 'talent' | 'producer', page: number = 1, project_id?: UniqueId, month?: number, year?: number) => `invoices/list_invoices?owner_type=${owner_type}&page=${page}${project_id ? '&project_id=' + project_id : ''}${month ? '&month=' + month : ''}${year ? '&year=' + year : ''}`,
	download_invoice: (invoice_id: UniqueId) => `invoices/download_invoice?invoice_id=${invoice_id}`,
	get_invoice_details: (owner_type?: 'talent' | 'producer', project_id?: UniqueId, month?: number, year?: number) => (owner_type ? `invoices/fetch_invoice_details?owner_type=${owner_type}${project_id ? '&project_id=' + project_id : ''}${month ? '&month=' + month : ''}${year ? '&year=' + year : ''}` : undefined),
	fetch_invoice_details: (loginType: 'talent' | 'producer', projectId: UniqueId) => `invoices/fetch_invoice_details?owner_type=${loginType}`,

	// studio owner
	studio_access_permission_list: (studio_id: UniqueId) => `studios/access_permission_list?studio_id=${studio_id}`,
	fetch_studio_team_members: (studio_id: UniqueId) => `studios/${studio_id}/fetch_team_members`,
	fetch_producer_team_members: (producer_id: string) => `producers/${producer_id}/fetch_team_members`,
	add_studio_team_member: (user_id: UniqueId, studio_id: UniqueId) => `studios/${studio_id}/add_team_member?user_id=${user_id}`,
	add_producer_team_member: (user_id: UniqueId) => `my_producer/add_team_member?user_id=${user_id}`,
	remove_studio_team_member: (user_id: UniqueId, studio_id: UniqueId) => `studios/${studio_id}/remove_team_member?user_id=${user_id}`,
	remove_producer_team_member: (user_id: UniqueId) => `my_producer/remove_team_member?user_id=${user_id}`,
	manage_studio_access: (studio_id: UniqueId) => `studios/${studio_id}/manage_studio_access`,
	manage_producer_access: 'my_producer/manage_producer_access',
	list_studio_permissions: (user_id: UniqueId, studio_id: UniqueId) => `studios/${studio_id}/list_studio_permissions?user_id=${user_id}`,
	list_producer_permissions: 'manage_producer_access/access_permission_list',
	fetch_producer_permissions: (user_id: UniqueId) => `my_producer/producer_access_permissions_list?user_id=${user_id}`,
	fetch_studio_floors: (studio_id: UniqueId) => `studios/${studio_id}/list_studio_floors`,
	location_videos: (studio_floor_id: UniqueId) => `studio_floors/${studio_floor_id}/list_videos`,
	list_services: (studio_floor_id: UniqueId) => `studio_floors/${studio_floor_id}/list_services`,

	// studio floors
	studio_floor_details: (id: UniqueId) => `studio_floors/${id}`,
	studio_floor_list_photos: (id: UniqueId) => `studio_floors/${id}/list_photos`,
	studio_floor_update_profile_picture: (id: UniqueId) => `studio_floors/${id}/update_profile_picture`,

	// studio floor bookings
	fetch_studio_floor_bookings: 'studio_floor_bookings',
	post_studio_floor_bookings: 'studio_floor_bookings',
	update_studio_floor_booking_status: 'studio_floor_bookings/update_booking_status',
	studio_floor_bookings: (floorId: UniqueId, status: EnumStudioStatus) => `studio_floor_bookings?studio_floor_id=${floorId}&status=${status}`,
	studio_calendar: (floorId: UniqueId, year_month: string) => `studio_floor_calendar?id=${floorId}&year_month=${year_month}`,
	list_bookings_by_date: (floorId: UniqueId, dateString: string) => `studio_floor_calendar/list_data_by_date?studio_floor_id=${floorId}&date=${dateString}`,
	studio_floor_block_dates: (floorId: UniqueId) => `studio_floor_calendar/block_dates?studio_floor_id=${floorId}`,
	// /api/v1/studio_floor_calendar/list_blocked_dates
	studio_floor_list_blocked_dates: (floorId: UniqueId) => `studio_floor_calendar/list_blocked_dates?studio_floor_id=${floorId}`,
	studio_floor_search: (q: string, dates: string, start_time: string, end_time: string, page: number, filters?: string) => `search/studio_floor?${q ? 'q=' + q : ''}&dates=${dates}&start_time=${start_time}&end_time=${end_time}&${filters ? filters : ''}&page=${page}`,
	book_studio_floor: 'studio_floor_bookings',

	list_booked_studio_floors: (projectId: UniqueId) => `projects/list_booked_sf${projectId ? '?project_id=' + projectId : ''}`,

	// studio messages
	list_all_studio_conversations: (owner_id: UniqueId, projectId: UniqueId, page: number) => `messages/list_all_conversations?owner_id=${owner_id}${projectId ? '&project_id=' + projectId : ''}&page=${page}&conversation_type=studio`,
	studio_optout: 'studio_floor_bookings/update_booking_status',
	studio_revise_claim: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/revise_claim`,
	studio_accept_claim: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/accept_claim`,
	studio_counter_offer: (negotiation_id: UniqueId) => `negotiations/${negotiation_id}/counter_offer?negotation_id=${negotiation_id}`,

	studio_edit_block_dates: 'studio_floor_calendar/edit_block_dates',
	studio_talent_permission: (studio_id: UniqueId, user_id: UniqueId) => `studios/${studio_id}/list_studio_permissions?user_id=${user_id}`,

	// mail
	send_email_otp: 'my_talent/send_email_otp',
	verify_email: 'my_talent/verify_email',
	send_report: 'reports/send_report',

	// subscription
	subscription_initiate: 'subscriptions',
	subscription_plans: 'subscription_plans',
	get_subscriptions: 'subscriptions',
	get_billing_history: 'subscription_billing_cycles?status=paid',
	subscription_current_status: 'subscriptions/current_subscription',
	auto_pay_status: 'subscriptions/',
	search_count: 'count_search',
	subscription_restriction: (screenId: string) => `subscription_restriction_configuration/?screen_id=${screenId}&screen_type=mobile`,
	subscription_plan_details: (subscription_plan_id: UniqueId) => `subscription_plans/${subscription_plan_id}`,
	cancel_subscriptions: (subscription_id: UniqueId) => `/subscriptions/${subscription_id}`,
	// video_type
	video_types: 'utils/populate_data?data_type=video_type',
	studio_floor_pricing: (studioId: UniqueId) => `studio_floor_pricings/?id=${studioId}`,
	studio_floor_pricing_by_video_type: (videoTypeId: UniqueId) => `studio_floor_pricings/${videoTypeId}`,

	//manager
	getActiveManager: 'talents/active_manager_relationship',
	search_managers: (master_type: string, searchQuery: string, page: number = 1) => `search/${master_type}?${searchQuery ? 'q=' + searchQuery : ''}`,
	intiateAssignManager: 'manager_talents/initialize_relationship',
	resend_manager_otp: (manger_talent_id: string) => `manager_talents/${manger_talent_id}/reinitialize_relationship`,
	validate_manager_otp: (manger_talent_id: string) => `manager_talents/${manger_talent_id}/verify_relationship`,
	remove_manager: (manager_talent_id: string) => `manager_talents/${manager_talent_id}`,
	manager_active_talents: (status: string) => `manager_talents?status=${status}`,
	manager_all_projects: (userId?: string, status?: EnumStatus, page: number = 1, query?: string) => `my_talent/list_talent_projects?${status ? 'status=' + status : ''}talent_id=${userId}&page=${page}${query ? '&q=' + query : ''}`,
	gst_manager_detail: (id: string, talentId: string) => `gst_details/${id}?talent_id=${talentId}`,
	gst_manager_details: (talentId: string) => `gst_details?talent_id=${talentId}`,
	get_all_active_manager_talent_gst: (talentId: string) => `gst_details?status=active&show_manager_talent_combined=true&talent_id=${talentId}`,
	update_manager_talent_profile: (talent_id: string) => `my_talent/update_user_profile?talent_id=${talent_id}`,

	//followUser
	followUser: 'follows',
	unFollowUser: (user_id: string) => `follows/${user_id}`,
	followingList: (user_id: string) => `users/${user_id}/following`,
	followersList: (user_id: string) => `users/${user_id}/followers`,
	followingStats: (user_id: string) => `users/${user_id}/follow_stats`,
	followingStatus: (follower_id: string) => `users/${follower_id}/follow_status`,

	//events
	events: (is_past:boolean,page: number = 1) => `events?is_past_event=${is_past}&page=${page}`,
	eventDetails: (id: string) => `events/${id}`,
	event_interested: (id: string) => `events/${id}/register`,
	event_optout: (id: string) => `events/${id}/unregister`,
	event_interested_status: (id:string) =>`events/${id}/get_event_interest_status_user`,
	event_cities :  'events/cities'
};
export default endpoints;
