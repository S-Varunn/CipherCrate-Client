import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useState, useMemo } from "react";

function App() {
  const [loading, setLoading] = useState(null);
  const [globalPassphrase, setGlobalPassphrase] = useState("");
  const providerContext = useMemo(
    () => ({ globalPassphrase, setGlobalPassphrase, loading, setLoading }),
    [globalPassphrase, setGlobalPassphrase, loading, setLoading]
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
        <Toaster />
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
