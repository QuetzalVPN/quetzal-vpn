import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import AdministartionPage from './pages/AdministrationPage';
import ConfigurationPage from './pages/ConfigurationPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/UserPage';
import {
  CogIcon,
  UsersIcon,
  WindowIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useCurrentPage } from './hooks/zustand';

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
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) ?? 'system'
  );

  // const browserRouter = createBrowserRouter([
  //   {
  //     path: '/',
  //     element: (
  //       <>
  //         <div className="flex gap-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
  //           <aside>
  //             <Navbar
  //               items={pages}
  //               setTheme={setTheme}
  //               activeIdx={currentPage}
  //             />
  //           </aside>
  //           <Outlet />
  //         </div>
  //       </>
  //     ),
  //     children: [
  //       ...pages,
  //       {
  //         path: '*',
  //         element: <NotFoundPage />,
  //       },
  //     ],
  //   },
  // ]);

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  useEffect(() => {
    //TODO: Fix FOUC
    if (theme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.theme = theme;
    }

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex gap-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                <aside>
                  <Navbar items={pages} setTheme={setTheme} />
                </aside>
                <Outlet />
              </div>
            </>
          }
        >
          <Route path="/" element={<Navigate to={pages[0].path} />} />
          {pages.map((page, idx) => (
            <Route path={page.path} element={page.element} key={page.path} />
          ))}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
