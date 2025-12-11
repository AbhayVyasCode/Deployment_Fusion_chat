import { useState, useEffect } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { FaUserPlus } from 'react-icons/fa';

const DiscoverFriends = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState([]);
    const { onlineUsers: onlineUserIds } = useSocketContext(); // Get the list of online IDs

    const fetchOnlineUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/friends/online');
            const data = await res.json();
            if (res.ok) {
                setOnlineUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // This effect runs when the component mounts and whenever the list of online user IDs changes.
    useEffect(() => {
        fetchOnlineUsers();
    }, [onlineUserIds]);

    const handleSendRequest = async (id) => {
        await fetch(`/api/friends/send/${id}`, { method: 'POST' });
        // Add the user to the sent list to disable the button
        setSentRequests([...sentRequests, id]);
        // Instantly remove the user from the discover list for a better UX
        setOnlineUsers(onlineUsers.filter(user => user._id !== id));
    };

    return (
        <div className="p-4 overflow-y-auto flex-1">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Discover Online Users</h3>
            {loading && <p className="text-center text-gray-500">Searching...</p>}
            {!loading && onlineUsers.length === 0 && <p className="text-sm text-center text-gray-500">No new users online right now.</p>}
            
            {!loading && (
                <ul className="space-y-3">
                    {onlineUsers.map(user => (
                        <li key={user._id} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={user.profilePic || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                                <span className="font-medium">{user.fullName}</span>
                            </div>
                            <button 
                                onClick={() => handleSendRequest(user._id)} 
                                disabled={sentRequests.includes(user._id)}
                                className="p-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaUserPlus />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DiscoverFriends;