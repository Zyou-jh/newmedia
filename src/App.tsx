import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const Welcome = lazy(() => import('./pages/Welcome'));
const StarWall = lazy(() => import('./pages/StarWall'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <Welcome />
            </Suspense>
          }
        />
        <Route
          path="/starwall"
          element={
            <Suspense fallback={<PageFallback />}>
              <StarWall />
            </Suspense>
          }
        />
        <Route
          path="/member/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <MemberProfile />
            </Suspense>
          }
        />
        <Route
          path="/gallery"
          element={
            <Suspense fallback={<PageFallback />}>
              <Gallery />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageFallback />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<PageFallback />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
