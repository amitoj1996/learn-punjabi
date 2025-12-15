import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TeacherOnboarding } from './pages/TeacherOnboarding';
import { TutorSearch } from './pages/TutorSearch';
import { StudentDashboard } from './pages/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teach" element={<TeacherOnboarding />} />
        <Route path="/tutors" element={<TutorSearch />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
