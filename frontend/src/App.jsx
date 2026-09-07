import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { DefectsPage } from './pages/DefectsPage';
import { AIWorkspacePage } from './pages/AIWorkspacePage';
import { RootCausePage } from './pages/RootCausePage';
import { CAPAPage } from './pages/CAPAPage';
import { ModelMonitoringPage } from './pages/ModelMonitoringPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="inspections" element={<InspectionsPage />} />
              <Route path="defects" element={<DefectsPage />} />
              <Route path="ai-workspace" element={<AIWorkspacePage />} />
              <Route path="root-cause" element={<RootCausePage />} />
              <Route path="capa" element={<CAPAPage />} />
              <Route path="model-monitoring" element={<ModelMonitoringPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
