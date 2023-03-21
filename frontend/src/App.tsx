import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import ConfigurationPage from './pages/ConfigurationPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/UserPage';

//TODO: Implement Router loader

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex gap-4">
                <Navbar />
                <div className="mt-8">
                  <Outlet />
                </div>
              </div>
            </>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
