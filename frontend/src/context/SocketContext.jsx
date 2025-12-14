import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';

// Create the context
const SocketContext = createContext();

// Custom hook to easily access the context's values
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// The provider component that will wrap our application
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    // This effect runs whenever the authentication status of the user changes.
    if (authUser) {
      // Determine the base URL based on the environment
      const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";
      
      // If the user is logged in, create a new socket connection.
      const newSocket = io(BASE_URL, {
        query: { userId: authUser._id },
        transports: ['websocket', 'polling'], // For increased connection stability
      });

      setSocket(newSocket);

      // Listen for the 'getOnlineUsers' event from the server to update the online status list.
      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // This is the cleanup function. It runs when the user logs out.
      // It ensures that the socket connection is properly closed.
      return () => {
        newSocket.close();
      };
    } else {
      // If the user is logged out, make sure any existing socket is closed.
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  // The dependency array [authUser] ensures this hook only runs when the user logs in or out.
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};