import { useState, useRef } from 'react';
import useChatStore from '../../store/useChatStore';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa'; // Import Paperclip icon

const MessageInput = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedUser, addMessage } = useChatStore();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select a file smaller than 5 MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setLoading(true);

    const formData = new FormData();
    if (text.trim()) {
      formData.append('text', text);
    }
    if (file) {
      formData.append('file', file);
    }

    try {
      // We send FormData, so the browser sets the correct 'multipart/form-data' header
      const res = await fetch(`/api/messages/send/${selectedUser._id}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      
      addMessage(data);
      setText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input visually
      }

    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-700">
        {file && (
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Selected file: {file.name}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            {/* File Upload Icon and Logic */}
            <div className="relative group">
                <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 text-gray-500 hover:text-blue-500">
                    <FaPaperclip size={20} />
                </button>
                <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Upload files and images (less than 5 MB)
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
                className="flex-1 px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
            />
            <button 
                type="submit" 
                disabled={loading || (!text.trim() && !file)} 
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300"
            >
                <FaPaperPlane />
            </button>
        </form>
    </div>
  );
};

export default MessageInput;