import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './Pages/LandingPage';
import { LoginPage } from './Pages/LoginPage';
import { ProfileEditPage } from './Pages/ProfileEditPage';
import { AdminPage } from './Pages/AdminPage';
import { UserPage } from './Pages/UserPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfileEditPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/:username" element={<UserPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
