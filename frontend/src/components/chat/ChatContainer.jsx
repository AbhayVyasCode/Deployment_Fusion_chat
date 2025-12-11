import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';
import MessageInput from './MessageInput';
import useListenMessages from '../../hooks/useListenMessages';
import { FaFileDownload } from 'react-icons/fa';

// Helper component for rendering different types of message content
const MessageContent = ({ msg }) => {
    const getFileName = (url) => {
        try {
            return decodeURIComponent(url.split('/').pop().split('?')[0].substring(14));
        } catch (e) {
            return "Download File";
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {msg.imageUrl && (
                <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img src={msg.imageUrl} alt="Sent image" className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                </a>
            )}
            {msg.fileUrl && (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download
                   className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors max-w-xs">
                    <FaFileDownload className="text-blue-500" />
                    <span className="truncate text-sm font-medium">{getFileName(msg.fileUrl)}</span>
                </a>
            )}
            {msg.text && <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>}
        </div>
    );
};

// Main container for the chat view
const ChatContainer = () => {
  const { selectedUser, messages } = useChatStore();
  const { authUser } = useAuthStore();
  useListenMessages(); // Hook for real-time message updates

  const chatEndRef = useRef(null);

  // Effect to automatically scroll to the latest message
  useEffect(() => {
    setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  // Determine if the chat should be disabled due to blocking
  const iHaveBlocked = authUser.blockedUsers.includes(selectedUser?._id);
  const theyHaveBlocked = selectedUser?.blockedUsers?.includes(authUser._id);
  const isChatDisabled = iHaveBlocked || theyHaveBlocked;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 shadow-sm">
        <div className="relative">
            <img src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${selectedUser.fullName}&background=random`} alt={selectedUser.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
            {/* You could add online status here if passed down or synced */}
        </div>
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedUser.fullName}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {/* Optional status text */}
            </p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <AnimatePresence initial={false}>
            {messages.map((msg) => {
            const fromMe = msg.senderId === authUser._id;
            const chatPartner = fromMe ? authUser : selectedUser;
            return (
                <motion.div 
                    key={msg._id || Math.random()} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-3 ${fromMe ? 'justify-end' : 'justify-start'}`}
                >
                {!fromMe && <img src={chatPartner.profilePic || `https://ui-avatars.com/api/?name=${chatPartner.fullName}&background=random`} alt="User" className="w-8 h-8 rounded-full object-cover shadow-sm mb-1" />}
                <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm relative group ${
                    fromMe 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700/50'
                }`}>
                    <MessageContent msg={msg} />
                    <p className={`text-[10px] mt-1 opacity-70 ${fromMe ? 'text-blue-100' : 'text-gray-400'} text-right`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
                {fromMe && <img src={chatPartner.profilePic || `https://ui-avatars.com/api/?name=${chatPartner.fullName}&background=random`} alt="User" className="w-8 h-8 rounded-full object-cover shadow-sm mb-1" />}
                </motion.div>
            );
            })}
        </AnimatePresence>
        
        {messages.length === 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60"
            >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-500 text-4xl">👋</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No messages yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Send a message to start the conversation!</p>
            </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Conditionally render the message input or a "blocked" message */}
      {isChatDisabled ? (
          <div className="p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              {iHaveBlocked ? "You have blocked this user. Unblock them from the Friends list to send a message." : "You cannot reply to this conversation."}
          </div>
      ) : (
          <div className="p-4 bg-white/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
             <MessageInput />
          </div>
      )}
    </div>
  );
};

// Component shown when no chat is selected from the sidebar
const NoChatSelected = () => {
    const { authUser } = useAuthStore();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
                <div className="relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl max-w-md">
                     <img src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.fullName}&background=random`} alt="Your Avatar" className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-white dark:border-gray-700 shadow-lg"/>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {authUser.fullName}!</h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Select a friend from the sidebar to start a secure, real-time conversation.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export { ChatContainer, NoChatSelected };