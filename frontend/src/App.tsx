import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConfigurationPage from './pages/ConfigurationPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';

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
                <Outlet />
              </div>
            </>
          }
        >
          <Route index path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
