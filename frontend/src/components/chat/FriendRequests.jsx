import { useState, useEffect } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { FaCheck, FaTimes } from 'react-icons/fa';

// The component now accepts the 'onFriendAction' prop
const FriendRequests = ({ onFriendAction }) => {
    const [requests, setRequests] = useState([]);
    const { socket } = useSocketContext();

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/friends/requests');
            const data = await res.json();
            if (res.ok) setRequests(data);
        } catch (error) {
            console.error("Failed to fetch friend requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();

        // Listen for new requests in real-time
        const handleNewRequest = () => fetchRequests();
        socket?.on('newFriendRequest', handleNewRequest);
        return () => socket?.off('newFriendRequest', handleNewRequest);
    }, [socket]);

    const handleAccept = async (id) => {
        try {
            const res = await fetch(`/api/friends/accept/${id}`, { method: 'POST' });
            if (res.ok) {
                // Remove the accepted request from the local list
                setRequests(requests.filter(req => req._id !== id));
                // ** THIS IS THE FIX **
                // Call the function passed from the parent to tell it to update the friends list
                onFriendAction(); 
            }
        } catch (error) {
            console.error("Failed to accept friend request:", error);
        }
    };

    return (
        <div className="p-4 overflow-y-auto flex-1">
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Friend Requests</h3>
            {requests.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">No new requests.</p> : (
                <ul className="space-y-2">
                    {requests.map(req => (
                        <li key={req._id} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <img src={req.profilePic || `https://ui-avatars.com/api/?name=${req.fullName}&background=random`} alt={req.fullName} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-medium">{req.fullName}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleAccept(req._id)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><FaCheck /></button>
                                {/* Reject logic can be added here with a similar callback */}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default FriendRequests;