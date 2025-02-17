import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
