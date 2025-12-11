import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Sidebar from '../components/chat/Sidebar';
import { ChatContainer, NoChatSelected } from '../components/chat/ChatContainer';
import useChatStore from '../store/useChatStore';
import FriendRequests from '../components/chat/FriendRequests';
import DiscoverFriends from '../components/chat/AddFriend';
import { useSocketContext } from '../context/SocketContext';

const ChatPage = () => {
  const { selectedUser, setSelectedUser, fetchMessages } = useChatStore();
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const { socket } = useSocketContext();

  // This is the central function for fetching and updating the friends list.
  // It's passed down as a prop to child components.
  const fetchFriends = async () => {
    try {
        const res = await fetch('/api/friends');
        const data = await res.json();
        if (res.ok) {
            setFriends(data);
        }
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        toast.error("Failed to load contacts");
    }
  };
  
  // This effect runs on initial load and sets up real-time listeners.
  useEffect(() => {
    fetchFriends();
    
    // This listener handles updates when another user accepts your request.
    const handleFriendUpdate = () => fetchFriends();
    socket?.on('friendRequestAccepted', handleFriendUpdate);
    
    // Cleanup function to prevent memory leaks.
    return () => {
        socket?.off('friendRequestAccepted', handleFriendUpdate);
    }
  }, [socket]);

  // This effect fetches the message history for the selected chat partner.
  useEffect(() => {
    if (selectedUser) {
      // Ensure the selected user is still a friend before fetching messages.
      if (friends.some(friend => friend._id === selectedUser._id)) {
        fetchMessages(selectedUser._id);
      } else {
        // If the selected user is no longer a friend (e.g., deleted), clear the chat window.
        setSelectedUser(null);
      }
    }
  }, [selectedUser, friends, fetchMessages, setSelectedUser]);

  return (
    <div className="min-h-screen relative overflow-hidden pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
         {/* Background Layers */}
         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0 opacity-80" />
         <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700/30 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0" />
         
         {/* Animated Blobs */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl z-0 pointer-events-none"
        />
        <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0], x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl z-0 pointer-events-none"
        />

        {/* Main Chat Interface Container */}
        <div className="relative z-10 container mx-auto px-4 h-[calc(100vh-140px)]">
            <div className="h-full flex bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              
              {/* Sidebar Area */}
              <div className="w-1/4 min-w-[300px] flex flex-col border-r border-gray-100 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/40">
                {/* Tab Navigation */}
                <div className="flex p-2 gap-1 bg-gray-50/50 dark:bg-gray-800/50 m-4 rounded-xl">
                    {['friends', 'requests', 'discover'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                                activeTab === tab 
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {activeTab === 'friends' && <Sidebar friends={friends} onAction={fetchFriends} />}
                    {activeTab === 'requests' && <FriendRequests onFriendAction={fetchFriends} />}
                    {activeTab === 'discover' && <DiscoverFriends />}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-white/30 dark:bg-gray-900/30">
                  {selectedUser ? <ChatContainer /> : <NoChatSelected />}
              </div>
            </div>
        </div>
    </div>
  );
};

export default ChatPage;