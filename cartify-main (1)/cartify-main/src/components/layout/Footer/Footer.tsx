import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const linkClass =
    "hover:text-primary cursor-pointer transition duration-200";

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-gray-300 text-sm mt-10">
      {/* 🔝 TOP */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-700">
        
        {/* 🔥 BRAND */}
        <div className="flex flex-col gap-3">
          <h2
            onClick={() => navigate("/")}
            className="text-xl font-bold text-white cursor-pointer"
          >
            CartiFy
          </h2>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for everything—fast, reliable, and affordable.
          </p>
        </div>

        {/* ABOUT */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">ABOUT</h4>
          <span className={linkClass} onClick={() => navigate("/contact")}>
            Contact Us
          </span>
          <span className={linkClass} onClick={() => navigate("/about")}>
            About Us
          </span>
          <span className={linkClass}>Careers</span>
          <span className={linkClass}>Press</span>
        </div>

        {/* HELP */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">HELP</h4>
          <span className={linkClass}>Payments</span>
          <span className={linkClass}>Shipping</span>
          <span className={linkClass}>Returns</span>
          <span className={linkClass}>FAQ</span>
        </div>

        {/* POLICY */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">POLICY</h4>
          <span className={linkClass}>Return Policy</span>
          <span className={linkClass}>Terms of Use</span>
          <span className={linkClass}>Security</span>
          <span className={linkClass}>Privacy</span>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">
            CONTACT
          </h4>

          <p className="text-gray-400 text-sm leading-relaxed">
            CartiFy Pvt Ltd <br />
            Bengaluru, India
          </p>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-2">
            <Facebook className="cursor-pointer hover:text-primary transition hover:scale-110" />
            <Twitter className="cursor-pointer hover:text-primary transition hover:scale-110" />
            <YouTube className="cursor-pointer hover:text-primary transition hover:scale-110" />
            <Instagram className="cursor-pointer hover:text-primary transition hover:scale-110" />
          </div>
        </div>
      </div>

      {/* 🔻 BOTTOM */}
      <div className="bg-black text-gray-400 text-center py-4 text-xs flex flex-col sm:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto">
        <p>© 2026 CartiFy. All rights reserved.</p>

        <div className="flex gap-4 mt-2 sm:mt-0">
          <span className={linkClass}>Privacy</span>
          <span className={linkClass}>Terms</span>
          <span className={linkClass}>Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;