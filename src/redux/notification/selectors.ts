import { RootState } from '../store';

const getNotificationCount = (state: RootState) => state.notification.notificationCount;

export default getNotificationCount;
