import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import useAuthStore from '../../store/useAuthStore';
import { FaCog } from 'react-icons/fa'; // Import gear icon
import { MessageSquareDashed } from 'lucide-react';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      navigate('/'); 
    } catch (error) {
      console.error(error);
      logout();
      navigate('/');
    }
  };

  return (
    <header className='bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300'>
      <nav className='container mx-auto px-6 py-4 flex justify-between items-center'>
        <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-opacity'>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquareDashed className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400'>
            FusionChat
            </span>
        </Link>
        <div className='hidden md:flex items-center space-x-8 text-lg'>
          <Link to="/" className='text-gray-600 dark:text-gray-300 hover:text-blue-500'>Home</Link>
          <Link to="/chat-friends" className='text-gray-600 dark:text-gray-300 hover:text-blue-500'>Chat with Friends</Link>
          <Link to="/chat-ai" className='text-gray-600 dark:text-gray-300 hover:text-blue-500'>Chat with AI</Link>
          <Link to="/voice-chat-ai" className='text-gray-600 dark:text-gray-300 hover:text-blue-500'>Voice Chat with AI</Link>
          <Link to="/about" className='text-gray-600 dark:text-gray-300 hover:text-blue-500'>About Us</Link>
        </div>
        <div className='flex items-center space-x-4'>
          {authUser ? (
            <>
              <Link to="/settings" className='text-gray-600 dark:text-gray-300 hover:text-blue-500 text-2xl'>
                <FaCog />
              </Link>
              <button
               onClick={handleLogout}
               className='bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600'
              >
               Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className='bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600'>
              Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;