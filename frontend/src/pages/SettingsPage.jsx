import { useState } from 'react';
import AssistantSettingsForm from '../components/forms/AssistantSettingsForm';
import ProfileSettingsForm from '../components/forms/ProfileSettingsForm';
import Card from '../components/ui/Card';

const SettingsPage = () => {
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">Settings</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">Manage your profile and assistant preferences.</p>
      
      {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
              <span className="block sm:inline">{successMessage}</span>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profile Settings Card */}
        <Card className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                Your Profile
            </h2>
            <ProfileSettingsForm setGlobalSuccess={setSuccessMessage} />
        </Card>

        {/* Assistant Settings Card */}
        <Card className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                Your Assistant
            </h2>
            <AssistantSettingsForm setGlobalSuccess={setSuccessMessage} />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;