import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { MantineProvider } from "@mantine/core";

import {
  Dashboard,
  ShoppingBag,
  MonetizationOn,
  Inventory2,
  Logout,
} from "@mui/icons-material";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out 👋");
    navigate("/", { replace: true });
  };

  const menu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag fontSize="small" />,
    },
    {
      label: "Earnings",
      path: "/admin/earnings",
      icon: <MonetizationOn fontSize="small" />,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: <Inventory2 fontSize="small" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <MantineProvider>
      <div className="flex h-screen bg-[#0f172a] text-white">
        {/* SIDEBAR */}
        <div className="w-[240px] bg-[#020617] border-r border-gray-800 p-5 flex flex-col justify-between">
          {/* TOP */}
          <div>
            <h2 className="text-2xl font-bold mb-8 tracking-wide">
              ⚡ CartiFy Admin
            </h2>

            <div className="space-y-2">
              {menu.map((item) => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Logout fontSize="small" />
            Logout
          </button>
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="h-16 bg-[#020617] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
            <h1 className="text-lg font-semibold">
              {menu.find((m) => isActive(m.path))?.label || "Dashboard"}
            </h1>

            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400">Welcome back 👋</p>

              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                A
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1200px] mx-auto p-6 w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};

export default AdminLayout;