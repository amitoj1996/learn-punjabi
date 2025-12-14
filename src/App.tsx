import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TeacherOnboarding } from './pages/TeacherOnboarding';
import { TutorSearch } from './pages/TutorSearch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teach" element={<TeacherOnboarding />} />
        <Route path="/tutors" element={<TutorSearch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
