import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TeacherOnboarding } from './pages/TeacherOnboarding';
import { TutorSearch } from './pages/TutorSearch';
import { EditProfile } from './pages/EditProfile';
import { AvailabilitySettings } from './pages/AvailabilitySettings';
import { LoginPage } from './pages/LoginPage';
import { DashboardRouter } from './routes/DashboardRouter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teach" element={<TeacherOnboarding />} />
        <Route path="/tutors" element={<TutorSearch />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/availability" element={<AvailabilitySettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
