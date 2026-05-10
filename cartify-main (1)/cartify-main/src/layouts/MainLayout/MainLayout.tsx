import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

import Navbar from "../../components/layout/Navbar/Navbar";
import SubNavbar from "../../components/layout/SubNavbar/SubNavbar";
import Footer from "../../components/layout/Footer/Footer";
import AuthModal from "../../components/auth/AuthModal";

const MainLayout = () => {
  const { isAuthOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div
      className={`bg-secondary min-h-screen flex flex-col ${
        isAuthOpen ? "overflow-hidden h-screen" : ""
      }`}
    >
      {/* 🔥 TOP NAV */}
      <Navbar />

      {/* 🔥 CATEGORY NAV */}
      <SubNavbar />

      {/* 🔥 MAIN CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
          {" "}
          <Outlet />
        </div>
      </main>

      {/* 🔥 FOOTER */}
      <Footer />

      {/* 🔥 MODAL */}
      <AuthModal />
    </div>
  );
};

export default MainLayout;
