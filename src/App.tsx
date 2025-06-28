import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/ui/Toaster';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeList from './pages/admin/EmployeeList';
import EmployeeDetails from './pages/admin/EmployeeDetails';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from './components/ui/Toaster';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-foreground text-lg font-medium">Loading TimeTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee', 'admin']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login\" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;