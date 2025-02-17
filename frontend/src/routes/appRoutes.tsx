import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import TaskCreate from "../pages/task/TaskCreate";
import NotFound from "../pages/NotFound";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import AuthLayout from "../components/cardComponent";
import PrivateRoute from "../components/PrivateRoute";
import TaskView from "../pages/task/TaskView";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          { path: "/", element: <Home /> },
          { path: "task", element: <TaskCreate /> },
          { path: "task/:id", element: <TaskView /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />, // Layout para páginas de autenticación (sin Navbar)
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
