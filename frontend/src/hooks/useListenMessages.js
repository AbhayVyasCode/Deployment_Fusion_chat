import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useChatStore from '../store/useChatStore';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { addMessage, selectedUser } = useChatStore();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Only add the message if it belongs to the current conversation
      if (selectedUser?._id === newMessage.senderId) {
        addMessage(newMessage);
      }
    };

    socket?.on('newMessage', handleNewMessage);

    return () => socket?.off('newMessage', handleNewMessage);
  }, [socket, selectedUser, addMessage]);
};

export default useListenMessages;