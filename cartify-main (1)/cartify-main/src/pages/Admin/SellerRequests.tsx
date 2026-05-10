// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import {
//   getSellerRequestsApi,
//   updateSellerStatusApi,
// } from "../../services/admin.seller.api";

// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#facc15", "#22c55e", "#ef4444"];

// const SellerRequests = () => {
//   const [requests, setRequests] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("ALL");
//   const [search, setSearch] = useState("");

//   const load = async () => {
//     try {
//       const data = await getSellerRequestsApi();
//       setRequests(data || []);
//     } catch {
//       toast.error("Failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);
//   const handleAction = async (
//     id: string,
//     status: "APPROVED" | "REJECTED",
//     reason?: string,
//   ) => {
//     try {
//       await updateSellerStatusApi(id, status, reason);
//       toast.success(`Request ${status.toLowerCase()} ✅`);
//       load();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed ❌");
//     }
//   };

//   const handleReject = async (id: string) => {
//     const reason = prompt("Enter rejection reason:");

//     if (!reason) return;

//     await handleAction(id, "REJECTED", reason);
//   };
//   // 📊 STATS
//   const stats = {
//     total: requests.length,
//     pending: requests.filter((r) => r.status === "PENDING").length,
//     approved: requests.filter((r) => r.status === "APPROVED").length,
//     rejected: requests.filter((r) => r.status === "REJECTED").length,
//   };

//   // 📊 CHART DATA
//   const pieData = [
//     { name: "Pending", value: stats.pending },
//     { name: "Approved", value: stats.approved },
//     { name: "Rejected", value: stats.rejected },
//   ];

//   // 🔍 FILTER + SEARCH
//   const filtered = requests.filter((r) => {
//     const matchStatus = filter === "ALL" ? true : r.status === filter;

//     const safe = (val: string) => val?.toLowerCase() || "";

//     const matchSearch =
//       safe(r.userId?.name).includes(search.toLowerCase()) ||
//       safe(r.userId?.email).includes(search.toLowerCase());

//     return matchStatus && matchSearch;
//   });

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       {/* 🔥 STATS CARDS */}
//       <div className="grid md:grid-cols-4 gap-4">
//         <StatCard title="Total" value={stats.total} />
//         <StatCard title="Pending" value={stats.pending} color="yellow" />
//         <StatCard title="Approved" value={stats.approved} color="green" />
//         <StatCard title="Rejected" value={stats.rejected} color="red" />
//       </div>

//       {/* 🔍 SEARCH + FILTER */}
//       <div className="flex flex-col md:flex-row gap-3 justify-between">
//         <input
//           type="text"
//           placeholder="Search user..."
//           className="border px-3 py-2 rounded-lg w-full md:w-1/3"
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="border px-3 py-2 rounded-lg"
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="ALL">All</option>
//           <option value="PENDING">Pending</option>
//           <option value="APPROVED">Approved</option>
//           <option value="REJECTED">Rejected</option>
//         </select>
//       </div>

//       {/* 📊 CHARTS */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* PIE */}
//         <div className="bg-white p-5 rounded-xl shadow">
//           <h3 className="font-semibold mb-3">Status Distribution</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie data={pieData} dataKey="value" outerRadius={80}>
//                 {pieData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* BAR */}
//         <div className="bg-white p-5 rounded-xl shadow">
//           <h3 className="font-semibold mb-3">Requests Overview</h3>

//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={pieData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#6366f1" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 🧾 LIST */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((r) => (
//           <div
//             key={r._id}
//             className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
//           >
//             <p className="font-semibold">{r.userId?.name || "No Name"}</p>

//             <p className="text-sm text-gray-500">
//               {r.userId?.email || "No Email"}
//             </p>

//             <div className="mt-3 text-sm space-y-1">
//               <p>Store: {r.storeName}</p>
//               <p>Type: {r.sellerType}</p>
//               <p>City: {r.city}</p>
//             </div>

//             <div className="mt-3">
//               <span className="text-xs px-2 py-1 bg-gray-200 rounded">
//                 {r.status}
//               </span>
//             </div>

//             {r.status === "PENDING" && (
//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() => handleAction(r._id, "APPROVED")}
//                   className="flex-1 bg-green-500 text-white py-1 rounded"
//                 >
//                   Approve
//                 </button>

//          <button
//   onClick={() => handleReject(r._id)}
//   className="flex-1 bg-red-500 text-white py-2 rounded-lg"
// >
//   Reject
// </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SellerRequests;

// // 🔥 STAT CARD COMPONENT
// const StatCard = ({ title, value, color }: any) => {
//   const colors: any = {
//     yellow: "bg-yellow-100 text-yellow-700",
//     green: "bg-green-100 text-green-700",
//     red: "bg-red-100 text-red-700",
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
//       <div>
//         <p className="text-sm text-gray-500">{title}</p>
//         <h2 className="text-xl font-bold">{value}</h2>
//       </div>

//       <div
//         className={`w-10 h-10 flex items-center justify-center rounded-full ${
//           colors[color] || "bg-gray-100"
//         }`}
//       >
//         📊
//       </div>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSellerRequestsApi,
  updateSellerStatusApi,
} from "../../services/admin.seller.api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Person,
  Store,
  LocationOn,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";

const COLORS = ["#facc15", "#22c55e", "#ef4444"];

const SellerRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const data = await getSellerRequestsApi();
      setRequests(data || []);
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ) => {
    try {
      await updateSellerStatusApi(id, status, reason);
      toast.success(`Request ${status.toLowerCase()} ✅`);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed ❌");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    await handleAction(id, "REJECTED", reason);
  };

  // 📊 STATS
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  };

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ];

  const filtered = requests.filter((r) => {
    const matchStatus = filter === "ALL" ? true : r.status === filter;

    const safe = (val: string) => val?.toLowerCase() || "";

    const matchSearch =
      safe(r.userId?.name).includes(search.toLowerCase()) ||
      safe(r.userId?.email).includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[220px] bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon="📊" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="yellow" />
        <StatCard title="Approved" value={stats.approved} icon="✅" color="green" />
        <StatCard title="Rejected" value={stats.rejected} icon="❌" color="red" />
      </div>

      {/* 🔍 SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <input
          placeholder="Search user..."
          className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Status Distribution">
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Requests Overview">
          <BarChart data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ChartCard>
      </div>

      {/* 🧾 LIST */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No requests found 😕
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition border"
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <Person />
                <div>
                  <p className="font-semibold">
                    {r.userId?.name || "No Name"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.userId?.email}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-4 text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <Store fontSize="small" /> {r.storeName}
                </p>
                <p className="flex items-center gap-2">
                  🏷 {r.sellerType}
                </p>
                <p className="flex items-center gap-2">
                  <LocationOn fontSize="small" /> {r.city}
                </p>
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <StatusBadge status={r.status} />
              </div>

              {/* ACTION */}
              {r.status === "PENDING" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(r._id, "APPROVED")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
                  >
                    <CheckCircle fontSize="small" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(r._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
                  >
                    <Cancel fontSize="small" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerRequests;

/* 🔥 COMPONENTS */

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      {children}
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ title, value, icon, color }: any) => {
  const colors: any = {
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>

      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${
          colors[color] || "bg-gray-100"
        }`}
      >
        {icon}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};