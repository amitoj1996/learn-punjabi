import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TeacherOnboarding } from './pages/TeacherOnboarding';
import { TutorSearch } from './pages/TutorSearch';
import { EditProfile } from './pages/EditProfile';
import { AvailabilitySettings } from './pages/AvailabilitySettings';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import { SuspendedPage } from './pages/SuspendedPage';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancelled } from './pages/PaymentCancelled';
import { DashboardRouter } from './routes/DashboardRouter';
import { LearnPage } from './pages/LearnPage';
import { SikhHistoryPage } from './pages/SikhHistoryPage';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isSuspended, suspensionInfo, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is suspended, show suspension page
  if (isSuspended) {
    return (
      <SuspendedPage
        reason={suspensionInfo?.reason}
        suspendedAt={suspensionInfo?.suspendedAt}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/teach" element={<TeacherOnboarding />} />
      <Route path="/tutors" element={<TutorSearch />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/availability" element={<AvailabilitySettings />} />
      <Route path="/messages" element={<ChatPage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/history" element={<SikhHistoryPage />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancelled" element={<PaymentCancelled />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
