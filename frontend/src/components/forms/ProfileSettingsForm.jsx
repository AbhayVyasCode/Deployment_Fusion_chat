import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { FaCamera } from 'react-icons/fa';

const ProfileSettingsForm = ({ setGlobalSuccess }) => {
  const { authUser, setAuthUser } = useAuthStore();
  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGlobalSuccess('');

    const formData = new FormData();
    if (fullName !== authUser.fullName) {
      formData.append('fullName', fullName);
    }
    if (profilePicFile) {
      formData.append('profilePic', profilePicFile);
    }

    if (!formData.entries().next().value) {
        setError("No changes to save.");
        setLoading(false);
        return;
    }
    
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      setAuthUser(data);
      setGlobalSuccess('Profile updated successfully!');
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
            src={previewImage || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=random`} 
            alt="Profile Preview" 
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-400 dark:border-gray-600"
          />
          <label htmlFor="profilePicUpload" className="absolute bottom-0 right-0 bg-gray-600 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700">
            <FaCamera />
            <input type="file" id="profilePicUpload" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="fullName" className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Your Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Saving...' : 'Save Profile Changes'}
      </button>
    </form>
  );
}; 

export default ProfileSettingsForm;