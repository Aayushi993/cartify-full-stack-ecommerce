import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Close,
  Logout,
  Inventory,
  AccountCircle,
  Store,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../../../features/ui/uiSlice";
import { logout } from "../../../features/auth/authSlice";
import type { RootState } from "../../../app/store";
import toast from "react-hot-toast";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0),
  );

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // 🔥 search submit (not auto)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = search.trim().toLowerCase().replace(/\s+/g, " ");

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out 👋");
    navigate("/");
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <header className="w-full bg-[#2874f0] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </button>

            <h1
              onClick={() => navigate("/")}
              className="text-xl font-bold cursor-pointer"
            >
              CartiFy
            </h1>
          </div>

          {/* 🔍 SEARCH */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 rounded-md text-black outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    navigate("/products");
                  }}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  ✖
                </button>
              )}
            </div>
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <button
                onClick={() => dispatch(openAuth("login"))}
                className="bg-white text-blue-600 px-4 py-1 rounded font-medium hover:shadow"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                {/* USER BTN */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="bg-white text-blue-600 px-4 py-1 rounded flex items-center gap-2"
                >
                  <Person fontSize="small" />
                  {user?.name}
                </button>

                {/* DROPDOWN */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-xl shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => navigate("/orders")}
                      className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      <Inventory fontSize="small" /> My Orders
                    </button>

                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      <AccountCircle fontSize="small" /> Profile
                    </button>

                    <button
                      onClick={() => navigate("/become-seller")}
                      className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                    >
                      <Store fontSize="small" /> Become Seller
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-50 text-red-500 text-sm"
                    >
                      <Logout fontSize="small" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error("Login required 🔐");
                  dispatch(openAuth("login"));
                  return;
                }
                navigate("/cart");
              }}
              className="relative bg-white text-blue-600 px-4 py-1 rounded flex items-center gap-2"
            >
              <ShoppingCart fontSize="small" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 🔥 MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="w-[260px] bg-white h-full p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <Close />
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="space-y-3">
              {!isLoggedIn ? (
                <button
                  onClick={() => dispatch(openAuth("login"))}
                  className="w-full text-left"
                >
                  Login
                </button>
              ) : (
                <>
                  <p className="font-semibold">{user?.name}</p>

                  <button onClick={() => navigate("/orders")}>My Orders</button>

                  <button onClick={() => navigate("/profile")}>Profile</button>

                  <button onClick={() => navigate("/become-seller")}>
                    Become Seller
                  </button>

                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
                </>
              )}

              <button onClick={() => navigate("/cart")}>
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
