import {
  CogIcon,
  UsersIcon,
  WindowIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import AdministartionPage from './pages/AdministrationPage';
import ConfigurationPage from './pages/ConfigurationPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import { useTheme } from './hooks/useTheme';

//TODO: Implement Router loader
//TODO: Fix types (they are really bad)

export type Theme = 'system' | 'light' | 'dark';

const pages = [
  {
    title: 'Dashboard',
    icon: <WindowIcon className="h-8" />,
    element: <DashboardPage navbarIdx={0} />,
    path: '/dashboard',
  },
  {
    title: 'Usermanager',
    icon: <UsersIcon className="h-8" />,
    element: <UserPage navbarIdx={1} />,
    path: '/users',
  },
  {
    title: 'Configuration',
    icon: <CogIcon className="h-8" />,
    element: <ConfigurationPage navbarIdx={2} />,
    path: '/configuration',
  },
  {
    title: 'Administration',
    icon: <WrenchScrewdriverIcon className="h-7" />,
    element: <AdministartionPage navbarIdx={3} />,
    path: '/administration',
  },
];

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <>
              <div className="flex gap-4">
                <aside className="min-w-fit left-0 top-0">
                  <Navbar items={pages} />
                </aside>
                {/* TODO: add gap to right end of page, care for detail popup */}
                <div className="overflow-y-scroll pr-4 flex-grow">
                  <Outlet />
                </div>
              </div>
            </>
          }
        >
          <Route path="/" element={<Navigate to={pages[0].path} />} />
          {pages.map((page) => (
            <Route path={page.path} element={page.element} key={page.path} />
          ))}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
