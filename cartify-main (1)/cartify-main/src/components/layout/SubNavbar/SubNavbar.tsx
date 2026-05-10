import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Devices,
  Checkroom,
  Home,
  Face,
  SportsBasketball,
  Toys,
  Category,
} from "@mui/icons-material";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Toys",
];

const categoryIcons: any = {
  All: <Category fontSize="small" />,
  Electronics: <Devices fontSize="small" />,
  Fashion: <Checkroom fontSize="small" />,
  Home: <Home fontSize="small" />,
  Beauty: <Face fontSize="small" />,
  Sports: <SportsBasketball fontSize="small" />,
  Toys: <Toys fontSize="small" />,
};

const SubNavbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const handleCategoryClick = (cat: string) => {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) params.set("search", search);

    if (cat !== "All") {
      params.set("category", cat);
    }

    const queryString = params.toString();

    setTimeout(() => {
      navigate(queryString ? `/products?${queryString}` : "/products", {
        replace: true,
      });
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    const activeEl = document.querySelector(".active-category");

    if (activeEl && containerRef.current) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [currentCategory, location.pathname]);

  return (
    <div className="w-full bg-white shadow-sm border-b sticky top-[64px] z-40">
      <div className="max-w-[1280px] mx-auto px-4">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto py-3 scrollbar-hide"
        >
          {categories.map((cat) => {
            const value = cat === "All" ? "" : cat;

            const isActive =
              (cat === "All" && !currentCategory) ||
              currentCategory.toLowerCase() === value.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-1 whitespace-nowrap text-sm font-medium transition relative ${
                  isActive
                    ? "text-primary active-category"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {categoryIcons[cat]}
                {cat}

                {isActive && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-primary rounded"></span>
                )}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-2 h-1 w-full bg-gray-200 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-primary animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubNavbar;