import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';

// Lazy-loaded pages for high-performance code-splitting
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Threats = lazy(() => import('./pages/Threats').then(m => ({ default: m.Threats })));
const ThreatDetails = lazy(() => import('./pages/ThreatDetails').then(m => ({ default: m.ThreatDetails })));
const Investigations = lazy(() => import('./pages/Investigations').then(m => ({ default: m.Investigations })));
const InvestigationDetails = lazy(() => import('./pages/InvestigationDetails').then(m => ({ default: m.InvestigationDetails })));
const Alerts = lazy(() => import('./pages/Alerts').then(m => ({ default: m.Alerts })));
const ThreatMapPage = lazy(() => import('./pages/ThreatMapPage').then(m => ({ default: m.ThreatMapPage })));
const CorrelationsPage = lazy(() => import('./pages/CorrelationsPage').then(m => ({ default: m.CorrelationsPage })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const ModelIntelligence = lazy(() => import('./pages/ModelIntelligence').then(m => ({ default: m.ModelIntelligence })));
const AuditLogs = lazy(() => import('./pages/AuditLogs').then(m => ({ default: m.AuditLogs })));
const UsersPage = lazy(() => import('./pages/Users').then(m => ({ default: m.UsersPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));

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
        <Suspense
          fallback={
            <div className="h-screen w-screen bg-background flex flex-col items-center justify-center font-mono text-cyan-400 gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs tracking-wider">INITIALIZING DOSSIER WORKSPACE...</span>
            </div>
          }
        >
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
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
