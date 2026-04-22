import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import { ProtectedRoute, PublicRoute } from './components/RouteGuards'
import DashboardPage from './pages/DashboardPage'
import LearnPage from './pages/LearnPage'
import LoginPage from './pages/LoginPage'
import ScanPage from './pages/ScanPage'
import SignupPage from './pages/SignupPage'
import WalletPage from './pages/WalletPage'

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/learn" element={<LearnPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
