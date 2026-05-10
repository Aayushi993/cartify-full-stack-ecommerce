// import { useState } from "react";
// import DashboardCharts from "./DashboardCharts";

// interface Stats {
//   products: number;
//   orders: number;
//   revenue: number;
// }

// const Dashboard = () => {
//   const [stats] = useState<Stats>({
//     products: 22,
//     orders: 240,
//     revenue: 142300,
//   });

//   const formatCurrency = (value: number) =>
//     value.toLocaleString("en-IN");

//   return (
//     <div className="space-y-8">
//       {/* TITLE */}
//       <h2 className="text-2xl font-bold">
//         Dashboard Overview 🚀
//       </h2>

//       {/* CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg text-white">
//           <p className="text-sm opacity-80">Total Products</p>
//           <h2 className="text-3xl font-bold">
//             {formatCurrency(stats.products)}
//           </h2>
//         </div>

//         <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-2xl shadow-lg text-white">
//           <p className="text-sm opacity-80">Total Orders</p>
//           <h2 className="text-3xl font-bold">
//             {formatCurrency(stats.orders)}
//           </h2>
//         </div>

//         <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-lg text-white">
//           <p className="text-sm opacity-80">Revenue</p>
//           <h2 className="text-3xl font-bold">
//             ₹{formatCurrency(stats.revenue)}
//           </h2>
//         </div>

//       </div>

//       {/* CHART */}
//       <div className="bg-[#020617] p-6 rounded-2xl shadow-lg border border-gray-800 text-white">
//         <h3 className="text-lg font-semibold mb-4">
//           Revenue Overview
//         </h3>

//         <DashboardCharts />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState } from "react";
import DashboardCharts from "./DashboardCharts";
import {
  Inventory2,
  ShoppingCart,
  CurrencyRupee,
  TrendingUp,
} from "@mui/icons-material";

interface Stats {
  products: number;
  orders: number;
  revenue: number;
}

const Dashboard = () => {
  const [stats] = useState<Stats>({
    products: 22,
    orders: 240,
    revenue: 142300,
  });

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-IN");

  return (
    <div className="space-y-8 text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Dashboard Overview 🚀
          </h2>
          <p className="text-gray-400 text-sm">
            Monitor your business performance
          </p>
        </div>

        <div className="text-sm text-gray-400">
          Last updated: Today
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <DashboardCard
          title="Total Products"
          value={formatCurrency(stats.products)}
          icon={<Inventory2 />}
          color="blue"
          growth="+12%"
        />

        <DashboardCard
          title="Total Orders"
          value={formatCurrency(stats.orders)}
          icon={<ShoppingCart />}
          color="green"
          growth="+8%"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${formatCurrency(stats.revenue)}`}
          icon={<CurrencyRupee />}
          color="purple"
          growth="+18%"
        />

      </div>

      {/* 🔥 CHART */}
      <div className="bg-[#020617] p-6 rounded-2xl shadow-lg border border-gray-800">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Revenue Overview
          </h3>

          <span className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp fontSize="small" /> +18% this month
          </span>
        </div>

        <DashboardCharts />
      </div>
    </div>
  );
};

export default Dashboard;

/* 🔥 CARD COMPONENT */
const DashboardCard = ({
  title,
  value,
  icon,
  color,
  growth,
}: any) => {
  const styles: any = {
    blue: "from-blue-600 to-blue-800",
    green: "from-green-600 to-green-800",
    purple: "from-purple-600 to-purple-800",
  };

  return (
    <div
      className={`bg-gradient-to-br ${styles[color]} p-6 rounded-2xl shadow-lg transition hover:scale-[1.02] cursor-pointer`}
    >
      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm opacity-80">{title}</p>

          <h2 className="text-3xl font-bold mt-1">
            {value}
          </h2>

          {/* 🔥 GROWTH */}
          <p className="text-xs mt-2 opacity-80">
            {growth} from last month
          </p>
        </div>

        {/* ICON */}
        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};