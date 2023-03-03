import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useState, useMemo } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const providerToken = useMemo(
    () => ({ token, setToken, user, setUser }),
    [token, setToken, user, setUser]
  );
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);
  return (
    <div>
      <AuthContext.Provider value={providerToken}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
