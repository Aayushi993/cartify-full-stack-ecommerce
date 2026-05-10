import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../features/auth/authSlice";

import {
  Menu,
  Dashboard,
  People,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";

const SuperAdminLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out 👋");
    navigate("/", { replace: true });
  };

  const isActive = (path: string) => {
    if (path === "/super-admin") {
      return location.pathname === "/super-admin";
    }

    return location.pathname.startsWith(path);
  };

  const menu = [
    {
      label: "Seller Requests",
      path: "/super-admin",
      icon: <Dashboard fontSize="small" />,
    },
    {
      label: "Users",
      path: "/super-admin/users",
      icon: <People fontSize="small" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 border-b flex items-center gap-2 font-bold text-lg">
          <AdminPanelSettings />
          Super Admin
        </div>

        <nav className="p-4 space-y-2 text-sm">
          <p className="text-gray-400 text-xs mb-2">MENU</p>

          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 p-2 rounded-lg transition ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-5 w-full px-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
          >
            <Logout fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden">
              <Menu />
            </button>

            <h1 className="font-semibold text-lg">
              {menu.find((m) => isActive(m.path))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Welcome 👋
            </span>

            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;