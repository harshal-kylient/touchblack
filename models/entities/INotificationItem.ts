export default interface INotificationItem {
	id: UniqueId;
	user_id: UniqueId;
	event: string | null;
	title: string | null;
	body: string | null;
	sound: boolean;
	icon: string | null;
	image: string | null;
	deeplink: any | null;
	clicked_at: string | null;
	notif_response: any | null;
	created_at: string | null;
	updated_at: string | null;
}
