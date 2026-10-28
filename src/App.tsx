import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ModalRoot } from './components/modals/ModalRoot';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Dashboard Protected Pages
import { Dashboard } from './pages/Dashboard';
import { MyProfile } from './pages/MyProfile';
import { AcademicRecords } from './pages/AcademicRecords';
import { Documents } from './pages/Documents';
import { VerificationCenter } from './pages/VerificationCenter';
import { Institutions } from './pages/Institutions';
import { AccessConsent } from './pages/AccessConsent';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

const AppLayout: React.FC = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-gov-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex-1 flex relative">
        {/* Animated Sidebar */}
        <Sidebar />

        {/* Main Content Workspace */}
        <main
          className="flex-1 transition-all duration-300 ease-out p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '270px',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/academic-records" element={<AcademicRecords />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/verification" element={<VerificationCenter />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/consent" element={<AccessConsent />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Government / Hackathon SIH Footer */}
          <footer className="mt-12 pt-6 pb-4 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 tracking-wider">APAAR</span>
              <span>• Automated Permanent Academic Account Registry</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono text-gov-blue-600 font-semibold">SIH26263 Live Integration</span>
              <span>•</span>
              <span>AICTE & Ministry of Education</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Supabase Auth Verified</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals and Notifications */}
      <ModalRoot />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Application Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
