import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Threats } from './pages/Threats';
import { ThreatDetails } from './pages/ThreatDetails';
import { Investigations } from './pages/Investigations';
import { InvestigationDetails } from './pages/InvestigationDetails';
import { Alerts } from './pages/Alerts';
import { ThreatMapPage } from './pages/ThreatMapPage';
import { CorrelationsPage } from './pages/CorrelationsPage';
import { Analytics } from './pages/Analytics';
import { ModelIntelligence } from './pages/ModelIntelligence';
import { AuditLogs } from './pages/AuditLogs';
import { UsersPage } from './pages/Users';
import { SettingsPage } from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-mono text-cyan-400">
        VERIFYING SESSION...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected SOC Operations Routes */}
          <Route
            path="/app/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/threats"
            element={
              <ProtectedRoute>
                <Threats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/threats/:id"
            element={
              <ProtectedRoute>
                <ThreatDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/investigations"
            element={
              <ProtectedRoute>
                <Investigations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/investigations/:id"
            element={
              <ProtectedRoute>
                <InvestigationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/map"
            element={
              <ProtectedRoute>
                <ThreatMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/correlations"
            element={
              <ProtectedRoute>
                <CorrelationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/models"
            element={
              <ProtectedRoute>
                <ModelIntelligence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/audit"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
