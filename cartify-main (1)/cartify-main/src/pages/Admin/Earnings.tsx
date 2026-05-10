// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   CartesianGrid,
// } from "recharts";
// import type { ReactNode } from "react";
// import type {
//   ValueType,
//   NameType,
// } from "recharts/types/component/DefaultTooltipContent";
// interface Revenue {
//   month: string;
//   amount: number;
// }

// interface Payout {
//   day: string;
//   value: number;
// }

// interface CardProps {
//   title: string;
//   value: string;
//   color: "purple" | "green" | "orange";
// }

// interface ChartCardProps {
//   title: string;
//   children: ReactNode;
// }

// const revenueData: Revenue[] = [
//   { month: "Jan", amount: 20000 },
//   { month: "Feb", amount: 30000 },
//   { month: "Mar", amount: 25000 },
//   { month: "Apr", amount: 40000 },
//   { month: "May", amount: 50000 },
// ];

// const payoutData: Payout[] = [
//   { day: "Mon", value: 5000 },
//   { day: "Tue", value: 7000 },
//   { day: "Wed", value: 6000 },
//   { day: "Thu", value: 8000 },
//   { day: "Fri", value: 9000 },
// ];


// const tooltipFormatter = (value: ValueType, _name: NameType) => {
//   let finalValue = value;

//   if (Array.isArray(finalValue)) {
//     finalValue = finalValue[0];
//   }

//   return `₹${Number(finalValue || 0).toLocaleString("en-IN")}`;
// };
// const Earnings = () => {
//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Earnings 💰</h2>

//       {/* CARDS */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <Card title="Total Earnings" value="₹2,42,300" color="purple" />
//         <Card title="Available Balance" value="₹32,000" color="green" />
//         <Card title="Pending" value="₹12,500" color="orange" />
//       </div>

//       {/* CHARTS */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <ChartCard title="Monthly Revenue">
//           <LineChart data={revenueData}>
//             <CartesianGrid stroke="#222" strokeDasharray="3 3" />
//             <XAxis dataKey="month" stroke="#888" />
//             <YAxis stroke="#888" />
//             <Tooltip formatter={tooltipFormatter} />
//             <Line dataKey="amount" stroke="#22c55e" strokeWidth={3} />
//           </LineChart>
//         </ChartCard>

//         <ChartCard title="Weekly Payouts">
//           <BarChart data={payoutData}>
//             <CartesianGrid stroke="#222" strokeDasharray="3 3" />
//             <XAxis dataKey="day" stroke="#888" />
//             <YAxis stroke="#888" />
//             <Tooltip formatter={tooltipFormatter} />
//             <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ChartCard>
//       </div>
//     </div>
//   );
// };

// const Card = ({ title, value, color }: CardProps) => (
//   <div
//     className={`bg-gradient-to-r from-${color}-600 to-${color}-800 p-5 rounded-xl shadow-lg text-white`}
//   >
//     <p className="text-sm opacity-80">{title}</p>
//     <p className="text-2xl font-bold mt-2">{value}</p>
//   </div>
// );

// const ChartCard = ({ title, children }: ChartCardProps) => (
//   <div className="bg-[#020617] p-5 rounded-xl border border-gray-800 text-white">
//     <h3 className="mb-4 font-semibold">{title}</h3>
//     <ResponsiveContainer width="100%" height={250}>
//       {children}
//     </ResponsiveContainer>
//   </div>
// );

// export default Earnings;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

import type { ReactNode } from "react";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  CurrencyRupee,
  AccountBalanceWallet,
  HourglassTop,
  TrendingUp,
} from "@mui/icons-material";

interface Revenue {
  month: string;
  amount: number;
}

interface Payout {
  day: string;
  value: number;
}

const revenueData: Revenue[] = [
  { month: "Jan", amount: 20000 },
  { month: "Feb", amount: 30000 },
  { month: "Mar", amount: 25000 },
  { month: "Apr", amount: 40000 },
  { month: "May", amount: 50000 },
];

const payoutData: Payout[] = [
  { day: "Mon", value: 5000 },
  { day: "Tue", value: 7000 },
  { day: "Wed", value: 6000 },
  { day: "Thu", value: 8000 },
  { day: "Fri", value: 9000 },
];

const tooltipFormatter = (value: ValueType) => {
  const val = Array.isArray(value) ? value[0] : value;
  return `₹${Number(val || 0).toLocaleString("en-IN")}`;
};

const Earnings = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Earnings 💰</h2>
          <p className="text-gray-400 text-sm">
            Track your financial performance
          </p>
        </div>

        <span className="text-green-400 text-sm flex items-center gap-1">
          <TrendingUp fontSize="small" /> +18% this month
        </span>
      </div>

      {/* 🔥 CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="Total Earnings"
          value="₹2,42,300"
          icon={<CurrencyRupee />}
          variant="purple"
        />

        <Card
          title="Available Balance"
          value="₹32,000"
          icon={<AccountBalanceWallet />}
          variant="green"
        />

        <Card
          title="Pending"
          value="₹12,500"
          icon={<HourglassTop />}
          variant="orange"
        />
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <ChartCard title="Monthly Revenue">
          <LineChart data={revenueData}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                background: "#020617",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Line
              dataKey="amount"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartCard>

        <ChartCard title="Weekly Payouts">
          <BarChart data={payoutData}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                background: "#020617",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartCard>

      </div>
    </div>
  );
};

export default Earnings;

/* 🔥 CARD FIXED (NO DYNAMIC TAILWIND BUG) */
const Card = ({
  title,
  value,
  icon,
  variant,
}: any) => {
  const styles: any = {
    purple: "from-purple-600 to-purple-800",
    green: "from-green-600 to-green-800",
    orange: "from-orange-600 to-orange-800",
  };

  return (
    <div
      className={`bg-gradient-to-r ${styles[variant]} p-5 rounded-xl shadow-lg transition hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>

        <div className="bg-white/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

/* 🔥 CHART CARD */
const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="bg-[#020617] p-5 rounded-xl border border-gray-800">
    <h3 className="mb-4 font-semibold">{title}</h3>

    <ResponsiveContainer width="100%" height={250}>
      {children}
    </ResponsiveContainer>
  </div>
);