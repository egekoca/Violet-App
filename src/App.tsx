import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './Pages/LandingPage';
import { LoginPage } from './Pages/LoginPage';
import { ProfileEditPage } from './Pages/ProfileEditPage';
import { UserPage } from './Pages/UserPage';
import { AdminPage } from './Pages/AdminPage';
import { LeaderboardPage } from './Pages/LeaderboardPage';
import './App.css'

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfileEditPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/:username" element={<UserPage />} />
    </Routes>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '16px',
          padding: '16px 24px',
          minWidth: '400px',
          maxWidth: '600px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </BrowserRouter>
  );
}

export default App;
