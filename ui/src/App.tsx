import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserPage } from './pages/UserPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/benimhesabim" replace />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/admin/:username" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

