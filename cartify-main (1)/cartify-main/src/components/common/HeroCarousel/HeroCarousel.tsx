import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Big Sale is Live",
    subtitle: "Up to 50% off on electronics",
    category: "electronics",
    image:
      "https://rukminim2.flixcart.com/fk-p-flap/3200/1560/image/8901a0a40b3f8b4e.png?q=60",
  },
  {
    title: "New Fashion Arrivals",
    subtitle: "Trendy styles for everyone",
    category: "fashion",
    image:
      "https://t3.ftcdn.net/jpg/07/00/56/44/240_F_700564497_fvftLEmH150p86ONnTABCaRBggIE8M0p.jpg",
  },
  {
    title: "Home Essentials",
    subtitle: "Upgrade your living space",
    category: "home",
    image:
      "https://images.jdmagicbox.com/comp/raipur-chhattisgarh/f5/9999px771.x771.101128153711.e4f5/catalogue/home-essentials-superbazar-tatibandh-raipur-chhattisgarh-supermarkets-xtrm2-250.jpg",
  },
];

const HeroCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1280px] mx-auto mt-2 mb-6 px-3">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="rounded-2xl overflow-hidden shadow-xl"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[200px] sm:h-[260px] md:h-[340px] lg:h-[320px] group">

              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* 🔥 OVERLAY (better gradient) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-4 sm:px-8 md:px-12 max-w-[70%] text-white">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                    {item.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base opacity-90">
                    {item.subtitle}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      navigate(`/products?category=${item.category}`)
                    }
                    className="mt-4 px-5 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-200 transition hover:scale-105"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;