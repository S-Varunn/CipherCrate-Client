import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Passphrase from "./components/passphrase/passphrase";
import Loading from "./components/loading/Loading";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/passphrase",
      element: <Passphrase />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
