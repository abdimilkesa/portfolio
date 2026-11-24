import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import { HomePage } from './pages/HomePage';
import { NotFound } from './pages/NotFound';
import { ProjectPage } from './pages/ProjectPage';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx').then((mod) => ({ default: mod.AdminLogin })));
const AdminShell = lazy(() => import('./pages/admin/AdminShell.jsx').then((mod) => ({ default: mod.AdminShell })));
const OverviewPage = lazy(() => import('./pages/admin/OverviewPage.jsx').then((mod) => ({ default: mod.OverviewPage })));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin.jsx').then((mod) => ({ default: mod.ProjectsAdmin })));
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin.jsx').then((mod) => ({ default: mod.SkillsAdmin })));
const ExperienceAdmin = lazy(() => import('./pages/admin/ExperienceAdmin.jsx').then((mod) => ({ default: mod.ExperienceAdmin })));
const ProfileAdmin = lazy(() => import('./pages/admin/ProfileAdmin.jsx').then((mod) => ({ default: mod.ProfileAdmin })));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin.jsx').then((mod) => ({ default: mod.MessagesAdmin })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/projects/:slug', element: <ProjectPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'projects', element: <ProjectsAdmin /> },
      { path: 'skills', element: <SkillsAdmin /> },
      { path: 'experience', element: <ExperienceAdmin /> },
      { path: 'profile', element: <ProfileAdmin /> },
      { path: 'messages', element: <MessagesAdmin /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<p className="grid min-h-dvh place-items-center text-muted">Loading…</p>}>
          <RouterProvider router={router} />
        </Suspense>
      </MotionConfig>
    </QueryClientProvider>
  );
}
