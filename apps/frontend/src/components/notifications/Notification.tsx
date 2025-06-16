import { FaSpinner } from "react-icons/fa";
import { useNotification } from "../../hooks/useNotification";
import type { Notification } from "../../store/useNotificationStore";

const Notification = () => {

  const { notifications, isLoading } = useNotification();
  
  return (
    <div className="absolute -left-52 top-8 mt-2 w-96 bg-white shadow-lg z-10 rounded-xl overflow-clip">
            <div className="">
              <div className="flex flex-col gap-1 justify-center items-center text-gray-700 border-b bg-[#7F37D8] px-4 py-6">
                <p className="font-medium text-white text-xl">Notifications</p>
              </div>
              <div className="flex flex-col gap-2">
              {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <FaSpinner className="animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex justify-center items-center p-8">
                    <p className="text-gray-500 text-sm">No notifications found</p>
                  </div>
                ) : (
                  notifications.map((notification: Notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </div>
            </div>
          </div>
  );
};

export default Notification

const NotificationItem = ({ notification }: { notification: Notification }) => {
  function timeAgo(dateString: string) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  } 
  return (
    <div className="flex flex-col gap-2 p-4 border-b border-gray-200">
      <p className="text-sm text-gray-700 text-justify">{notification.message}</p>
      <p className="text-xs text-gray-500 text-right">  {timeAgo(notification.createdAt)}</p>
    </div>
  );
};