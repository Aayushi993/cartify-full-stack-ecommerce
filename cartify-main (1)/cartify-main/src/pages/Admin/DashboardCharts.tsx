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

interface SalesData {
  name: string;
  revenue: number;
}

interface OrdersData {
  name: string;
  orders: number;
}

const salesData: SalesData[] = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
];

const ordersData: OrdersData[] = [
  { name: "Mon", orders: 20 },
  { name: "Tue", orders: 35 },
  { name: "Wed", orders: 25 },
  { name: "Thu", orders: 40 },
  { name: "Fri", orders: 30 },
];

// 🔥 custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded shadow text-xs">
        <p>{payload[0].name}</p>
        <p className="font-semibold">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardCharts = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* REVENUE */}
      <div className="bg-[#020617] p-5 rounded-xl border border-gray-800 text-white">
        <h3 className="mb-4 font-semibold">Revenue Trend</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <CartesianGrid stroke="#222" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ORDERS */}
      <div className="bg-[#020617] p-5 rounded-xl border border-gray-800 text-white">
        <h3 className="mb-4 font-semibold">Orders Overview</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ordersData}>
            <CartesianGrid stroke="#222" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />

            <Bar
              dataKey="orders"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;