import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useState, useMemo } from "react";

function App() {
  const [loading, setLoading] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const providerContext = useMemo(
    () => ({ passphrase, setPassphrase, loading, setLoading }),
    [passphrase, setPassphrase, loading, setLoading]
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
      <AuthContext.Provider value={providerContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
