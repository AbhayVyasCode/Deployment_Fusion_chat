import useChatStore from '../../store/useChatStore';
import { useSocketContext } from '../../context/SocketContext';
import useAuthStore from '../../store/useAuthStore';
import { FaUserSlash, FaUserCheck, FaTrashAlt } from 'react-icons/fa';

const Sidebar = ({ friends, onAction }) => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useSocketContext();
    const { authUser, setAuthUser } = useAuthStore();

    // Generic handler for all actions (block, unblock, delete)
    const handleFriendAction = async (action, friend) => {
        let url, method;

        switch (action) {
            case 'block':
                url = `/api/friends/block/${friend._id}`;
                method = 'POST';
                break;
            case 'unblock':
                url = `/api/friends/unblock/${friend._id}`;
                method = 'POST';
                break;
            case 'delete':
                if (!window.confirm(`Are you sure you want to remove ${friend.fullName} as a friend?`)) return;
                url = `/api/friends/delete/${friend._id}`;
                method = 'DELETE';
                break;
            default: return;
        }

        try {
            const res = await fetch(url, { method });
            if (!res.ok) throw new Error('Action failed');

            // On success, refresh the global user state and the local friends list
            const userRes = await fetch('/api/auth/check');
            const userData = await userRes.json();
            setAuthUser(userData);
            onAction(); // This prop function tells ChatPage to refetch friends

            // If the deleted friend was the selected user, clear the chat window
            if (action === 'delete' && selectedUser?._id === friend._id) {
                setSelectedUser(null);
            }

        } catch (error) {
            console.error("Friend action error:", error);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No friends yet.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {friends.map((user) => {
                        const isOnline = onlineUsers.includes(user._id);
                        const isBlocked = authUser.blockedUsers.includes(user._id);
                        const isSelected = selectedUser?._id === user._id;

                        return (
                            <li 
                                key={user._id} 
                                className={`group p-3 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer border ${
                                    isSelected 
                                    ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                                    : 'bg-white/40 dark:bg-gray-800/40 border-transparent hover:bg-white/60 dark:hover:bg-gray-700/60'
                                }`}
                                onClick={() => setSelectedUser(user)}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative">
                                        <img 
                                            src={user.profilePic || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`} 
                                            alt={user.fullName} 
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 dark:ring-gray-700/50 shadow-sm" 
                                        />
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {user.fullName}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {isOnline ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={() => handleFriendAction(isBlocked ? 'unblock' : 'block', user)} 
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 text-gray-400 hover:text-yellow-500 transition-colors"
                                        title={isBlocked ? 'Unblock' : 'Block'}
                                    >
                                        {isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                                    </button>
                                    <button 
                                        onClick={() => handleFriendAction('delete', user)} 
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;