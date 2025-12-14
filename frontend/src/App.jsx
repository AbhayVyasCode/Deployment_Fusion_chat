// import { useEffect } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Navbar from './components/layout/Navbar.jsx';
// import Footer from './components/layout/Footer.jsx';
// import HomePage from './pages/HomePage.jsx';
// import AuthPage from './pages/AuthPage.jsx';
// import GenericPage from './pages/GenericPage.jsx';
// import AboutUsPage from './pages/AboutUsPage.jsx';
// import VoiceChatPage from './pages/VoiceChatPage.jsx';
// import SettingsPage from './pages/SettingsPage.jsx';
// import ChatWithAiPage from './pages/ChatWithAiPage.jsx';
// import useThemeStore from './store/useThemeStore.js';
// import useAuthStore from './store/useAuthStore.js';

// // HOC to check if the user has customized their assistant
// const CustomizationCheck = ({ children }) => {
//     const { authUser } = useAuthStore();
//     const location = useLocation();

//     // If user is logged in but hasn't configured their assistant, redirect to settings,
//     // unless they are already trying to go to the settings page.
//     if (authUser && (!authUser.assistantName || !authUser.assistantImage) && location.pathname !== '/settings') {
//         return <Navigate to="/settings" />;
//     }
//     return children;
// };

// // HOC to protect routes that require a user to be logged in
// const ProtectedRoute = ({ children }) => {
//   const { authUser, isLoading } = useAuthStore();

//   if (isLoading) {
//     // While checking authentication status, show a loading indicator
//     return <div className="text-center p-10">Loading...</div>;
//   }

//   // If not loading and no authenticated user, redirect to the login page
//   return authUser ? children : <Navigate to="/auth" />;
// };

// function App() {
//   const { theme } = useThemeStore();
//   const { authUser, setAuthUser, isLoading, setIsLoading } = useAuthStore();

//   // Effect to apply the dark/light theme class to the HTML element
//   useEffect(() => {
//     document.documentElement.className = theme;
//   }, [theme]);

//   // Effect to check the user's authentication status on initial application load
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const res = await fetch('/api/auth/check');
//         if (res.ok) {
//             const data = await res.json();
//             setAuthUser(data); // Set the user in the global state if the session is valid
//         }
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//       } finally {
//         // Always set loading to false after the check is complete
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, [setAuthUser, setIsLoading]);

//   // Show a full-screen loading message while the initial auth check is in progress
//   if (isLoading) {
//     return (
//         <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-xl">
//             Loading Application...
//         </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
//       <Navbar />
//       <main className="flex-grow container mx-auto px-6 py-8">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
//           <Route path="/about" element={<AboutUsPage />} />
          
//           {/* Protected Routes: These routes require the user to be logged in */}
//           <Route 
//             path="/chat-friends" 
//             element={
//               <ProtectedRoute>
//                 <CustomizationCheck>
//                   <GenericPage title="Chat with Friends" />
//                 </CustomizationCheck>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/chat-ai" 
//             element={
//               <ProtectedRoute>
//                 <CustomizationCheck>
//                   <ChatWithAiPage />
//                 </CustomizationCheck>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/voice-chat-ai" 
//             element={
//               <ProtectedRoute>
//                 <CustomizationCheck>
//                   <VoiceChatPage />
//                 </CustomizationCheck>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/settings" 
//             element={
//               <ProtectedRoute>
//                 <SettingsPage />
//               </ProtectedRoute>
//             } 
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;


import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import useThemeStore from './store/useThemeStore.js';
import useAuthStore from './store/useAuthStore.js';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage.jsx'));
const VoiceChatPage = lazy(() => import('./pages/VoiceChatPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const ChatWithAiPage = lazy(() => import('./pages/ChatWithAiPage.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));

// HOC to check if the user has customized their assistant
const CustomizationCheck = ({ children }) => {
    const { authUser } = useAuthStore();
    const location = useLocation();

    // If user is logged in but hasn't configured their assistant, redirect to settings,
    // unless they are already trying to go to the settings page.
    if (authUser && (!authUser.assistantName || !authUser.assistantImage) && location.pathname !== '/settings') {
        return <Navigate to="/settings" />;
    }
    return children;
};

// HOC to protect routes that require a user to be logged in
const ProtectedRoute = ({ children }) => {
  const { authUser, isLoading } = useAuthStore();

  if (isLoading) {
    // While checking authentication status, show a loading indicator
    return <div className="text-center p-10">Loading User...</div>;
  }

  // If not loading and no authenticated user, redirect to the login page
  return authUser ? children : <Navigate to="/auth" />;
};

function App() {
  const { theme } = useThemeStore();
  const { authUser, setAuthUser, isLoading, setIsLoading } = useAuthStore();
  const location = useLocation();

  // Effect to apply the dark/light theme class to the HTML element
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Effect to check the user's authentication status on initial application load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
            const data = await res.json();
            setAuthUser(data); // Set the user in the global state if the session is valid
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        // Always set loading to false after the check is complete
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [setAuthUser, setIsLoading]);

  // Show a full-screen loading message while the initial auth check is in progress
  if (isLoading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900 text-xl">
             <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-200 transition-colors duration-300 bg-white dark:bg-gray-900">
      <Navbar />
      <main className={location.pathname === '/' ? "flex-grow w-full" : "flex-grow container mx-auto px-6 py-8"}>
        <Suspense fallback={
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
            <Route path="/about" element={<AboutUsPage />} />
            
            {/* Protected Routes: These routes require the user to be logged in and have a configured assistant */}
            <Route 
              path="/chat-friends" 
              element={
                <ProtectedRoute>
                  <CustomizationCheck>
                    <ChatPage />
                  </CustomizationCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat-ai" 
              element={
                <ProtectedRoute>
                  <CustomizationCheck>
                    <ChatWithAiPage />
                  </CustomizationCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/voice-chat-ai" 
              element={
                <ProtectedRoute>
                  <CustomizationCheck>
                    <VoiceChatPage />
                  </CustomizationCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;

