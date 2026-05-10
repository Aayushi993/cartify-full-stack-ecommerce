import { useState, useCallback } from "react";

const HomeContent = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto mt-12 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition relative">
        
        {/* HEADER */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          CartiFy: Your One-Stop Shopping Destination 🛍️
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Discover millions of products across electronics, fashion, home
          essentials, and more. CartiFy brings you a seamless, affordable, and
          reliable shopping experience.
        </p>

        {/* HIGHLIGHTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
          {[
            "⚡ Fast Delivery",
            "🔒 Secure Payments",
            "🔄 Easy Returns",
            "🎧 24/7 Support",
          ].map((item) => (
            <div
              key={item}
              className="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition"
            >
              {item}
            </div>
          ))}
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative mt-6">
          <div
            className={`transition-all duration-500 overflow-hidden ${
              expanded ? "max-h-[600px]" : "max-h-[120px]"
            }`}
          >
            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <div>
                <strong className="text-gray-800">📱 Electronics:</strong> Latest
                mobiles, laptops, smart devices & accessories.
              </div>

              <div>
                <strong className="text-gray-800">🏠 Home & Kitchen:</strong>{" "}
                Appliances, decor, and everyday essentials.
              </div>

              <div>
                <strong className="text-gray-800">👗 Fashion:</strong> Trendy
                outfits, footwear & accessories.
              </div>

              <div>
                <strong className="text-gray-800">💄 Beauty:</strong> Skincare,
                grooming & wellness products.
              </div>

              <p className="mt-2">
                Enjoy smooth shopping with fast delivery, secure payments, and
                top-notch support every time.
              </p>
            </div>
          </div>

          {/* 🔥 GRADIENT FADE */}
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* 🔥 INLINE TOGGLE (no button look) */}
        <div className="mt-3 text-sm">
          <span
            onClick={toggleExpand}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            {expanded ? "Show less" : "Continue reading"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HomeContent;