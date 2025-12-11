import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { FaCamera } from 'react-icons/fa';

const AssistantSettingsForm = ({ onSuccess, setGlobalSuccess }) => {
  const { authUser, setAuthUser } = useAuthStore();
  
  // State for form fields
  const [assistantName, setAssistantName] = useState(authUser?.assistantName || '');
  const [assistantImageFile, setAssistantImageFile] = useState(null);
  
  // State for UI feedback
  const [previewImage, setPreviewImage] = useState(authUser?.assistantImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles the selection of a new image file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Please select a file smaller than 5 MB.");
        return;
      }
      setAssistantImageFile(file);
      // Create a temporary local URL to show a preview of the image
      setPreviewImage(URL.createObjectURL(file));
      setError(''); // Clear previous errors
    }
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (setGlobalSuccess) setGlobalSuccess('');

    // Use FormData to send both text and file data
    const formData = new FormData();

    // Only append data if it has actually changed to avoid unnecessary updates
    if (assistantName !== (authUser.assistantName || '')) {
      formData.append('assistantName', assistantName);
    }
    if (assistantImageFile) {
      formData.append('assistantImage', assistantImageFile);
    }

    // Check if there are any changes to save
    if (!formData.entries().next().value) {
        setError("No changes to save.");
        setLoading(false);
        return;
    }
    
    try {
      // Send the request to the backend
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update assistant settings');
      }
      
      // On success, update the global user state
      setAuthUser(data);
      if (setGlobalSuccess) setGlobalSuccess('Assistant updated successfully!');
      
      // If an onSuccess callback is provided (for the modal), call it
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img 
            src={previewImage || `https://ui-avatars.com/api/?name=${assistantName || 'AI'}&background=random`} 
            alt="Assistant Preview" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <label htmlFor="assistantImageUpload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
            <FaCamera />
            <input type="file" id="assistantImageUpload" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="assistantName" className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Assistant's Name
        </label>
        <input
          id="assistantName"
          type="text"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          placeholder="e.g., Jarvis, Friday"
          className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        {loading ? 'Saving...' : 'Save Assistant Changes'}
      </button>
    </form>
  );
};

export default AssistantSettingsForm;
