import { create } from 'zustand';

const useChatStore = create((set) => ({
  selectedUser: null,
  messages: [],
  
  // Action to set the currently selected user for chatting
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  
  // Action to fetch the message history for the selected user
  fetchMessages: async (userId) => {
    try {
      const res = await fetch(`/api/messages/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
      
      if (Array.isArray(data)) {
        set({ messages: data });
      } else {
        set({ messages: [] });
      }
    } catch (error) {
      console.error("fetchMessages error:", error.message);
      set({ messages: [] }); // Set to empty array on error to prevent crashes
    }
  },
  
  // Action to add a new message to the state
  // This will be used by both the sender and the real-time listener
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));

export default useChatStore;