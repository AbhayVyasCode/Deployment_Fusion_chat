import { create } from 'zustand';

const useAssistantStore = create((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  // Updated to accept a full message object
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

export default useAssistantStore;
