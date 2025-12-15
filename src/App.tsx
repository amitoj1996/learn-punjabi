import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TeacherOnboarding } from './pages/TeacherOnboarding';
import { TutorSearch } from './pages/TutorSearch';
import { DashboardRouter } from './routes/DashboardRouter';
// import { StudentDashboard } from './pages/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teach" element={<TeacherOnboarding />} />
        <Route path="/tutors" element={<TutorSearch />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
