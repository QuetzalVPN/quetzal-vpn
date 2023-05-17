import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import {CogIcon, UsersIcon, WindowIcon, WrenchScrewdriverIcon} from "@heroicons/react/24/outline";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import AdministrationPage from "./pages/AdministrationPage";
import {ToastContainer} from "react-toastify";
import {useSidebarState} from "./hooks/zustand";
import ConfigurationPage from "./pages/ConfigurationPage";

const pages = [
  {
    title: 'Dashboard',
    icon: <WindowIcon className="h-8"/>,
    element: <DashboardPage navbarIdx={0}/>,
    path: '/dashboard',
  },
  {
    title: 'Usermanager',
    icon: <UsersIcon className="h-8"/>,
    element: <UserPage navbarIdx={1}/>,
    path: '/users/:id?',
  },
  {
    title: 'Configuration',
    icon: <CogIcon className="h-8"/>,
    element: <ConfigurationPage navbarIdx={2}/>,
    path: '/configuration',
  },
  {
    title: 'Administration',
    icon: <WrenchScrewdriverIcon className="h-7"/>,
    element: <AdministrationPage navbarIdx={3}/>,
    path: '/administration',
  },
];

export default () => {
  const {sidebar: sidebarOpen} = useSidebarState();

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route
        path="/"
        element={<>
          <div className="flex gap-4">
            <div className="min-w-fit left-0 top-0">
              <Navbar items={pages}/>
            </div>
            <div className={`flex-grow ${sidebarOpen ? '' : 'pr-4'}`}>
              <Outlet/>
              <ToastContainer/>
            </div>
          </div>
        </>}
      >
        <Route path="/" element={<Navigate to={pages[0].path}/>}/>
        {pages.map((page) => (
          <Route path={page.path} element={page.element} key={page.path}/>
        ))}
      </Route><Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  </BrowserRouter>
}