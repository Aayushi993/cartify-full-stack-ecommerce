// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import {
//   getSellerOrdersApi,
//   updateOrderStatusApi,
// } from "../../services/order.api";

// const SellerOrders = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   const [selectedStatus, setSelectedStatus] = useState<any>({});
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await getSellerOrdersApi();
//       setOrders(res?.data || []);
//       setFiltered(res?.data || []);
//     } catch {
//       toast.error("Failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // 🔥 SEARCH
//   useEffect(() => {
//     const filteredData = orders.filter((o) =>
//       o._id.toLowerCase().includes(search.toLowerCase())
//     );
//     setFiltered(filteredData);
//     setPage(1);
//   }, [search, orders]);

//   // 🔥 PAGINATION
//   const start = (page - 1) * limit;
//   const paginated = filtered.slice(start, start + limit);

//   const getNextStatuses = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return ["PAID", "CANCELLED"];
//       case "PAID":
//         return ["SHIPPED", "CANCELLED"];
//       case "SHIPPED":
//         return ["DELIVERED"];
//       default:
//         return [];
//     }
//   };

//   const handleUpdate = async (id: string) => {
//     const status = selectedStatus[id];
//     if (!status) return;

//     try {
//       setUpdatingId(id);
//       await updateOrderStatusApi(id, status);
//       toast.success("Updated ✅");
//       fetchOrders();
//     } catch {
//       toast.error("Failed ❌");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Orders 📦</h2>

//         {/* 🔥 SEARCH */}
//         <input
//           placeholder="Search Order ID..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
//         />
//       </div>

//       {/* LIST */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : paginated.length === 0 ? (
//         <p>No orders found</p>
//       ) : (
//         <div className="space-y-5">
//           {paginated.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#020617] border border-gray-800 rounded-xl p-5"
//             >
//               {/* HEADER */}
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <p className="text-xs text-gray-400">Order ID</p>
//                   <p className="font-semibold">{order._id}</p>
//                 </div>

//                 <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
//                   {order.status}
//                 </span>
//               </div>

//               {/* 🔥 CUSTOMER */}
//               <div className="mb-3 text-sm text-gray-300">
//                 <p>👤 {order.userId?.name}</p>
//                 <p>📍 {order.address?.city}</p>
//               </div>

//               {/* 🔥 PRODUCTS */}
//               <div className="space-y-3 border-t border-gray-800 pt-3">
//                 {order.items?.map((item: any) => (
//                   <div
//                     key={item._id}
//                     className="flex gap-3 items-center"
//                   >
//                     {/* 🔥 IMAGE */}
//                     <img
//                       src={
//                         item.productId?.images?.[0]?.url ||
//                         "https://via.placeholder.com/60"
//                       }
//                       className="h-14 w-14 rounded object-cover"
//                     />

//                     <div className="flex-1">
//                       <p className="text-sm font-medium">
//                         {item.productId?.title || "Product"}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>

//                     <p className="text-green-400 font-semibold">
//                       ₹{item.price}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* ACTION */}
//               {getNextStatuses(order.status).length > 0 && (
//                 <div className="mt-4 flex justify-between items-center border-t border-gray-800 pt-3">
//                   <p className="text-sm text-gray-400">Update Status</p>

//                   <div className="flex gap-2">
//                     <select
//                       value={selectedStatus[order._id] || ""}
//                       onChange={(e) =>
//                         setSelectedStatus({
//                           ...selectedStatus,
//                           [order._id]: e.target.value,
//                         })
//                       }
//                       className="bg-gray-900 border border-gray-700 px-3 py-1 rounded"
//                     >
//                       <option value="">Select</option>
//                       {getNextStatuses(order.status).map((s) => (
//                         <option key={s}>{s}</option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={() => handleUpdate(order._id)}
//                       className="bg-blue-600 px-3 py-1 rounded"
//                     >
//                       Update
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🔥 PAGINATION */}
//       <div className="flex justify-center gap-3 mt-6">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-3 py-1 bg-gray-800 rounded"
//         >
//           Prev
//         </button>

//         <span>{page}</span>

//         <button
//           disabled={start + limit >= filtered.length}
//           onClick={() => setPage(page + 1)}
//           className="px-3 py-1 bg-gray-800 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSellerOrdersApi,
  updateOrderStatusApi,
} from "../../services/order.api";

import {
  Search,
  Person,
  LocationOn,
  Inventory2,
  Update,
} from "@mui/icons-material";

const SellerOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [selectedStatus, setSelectedStatus] = useState<any>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getSellerOrdersApi();
      setOrders(res?.data || []);
      setFiltered(res?.data || []);
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 SEARCH
  useEffect(() => {
    const filteredData = orders.filter((o) =>
      o._id.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [search, orders]);

  // 🔥 PAGINATION
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const getNextStatuses = (status: string) => {
    switch (status) {
      case "PENDING":
        return ["PAID", "CANCELLED"];
      case "PAID":
        return ["SHIPPED", "CANCELLED"];
      case "SHIPPED":
        return ["DELIVERED"];
      default:
        return [];
    }
  };

  const handleUpdate = async (id: string) => {
    const status = selectedStatus[id];
    if (!status) return toast.error("Select status");

    try {
      setUpdatingId(id);
      await updateOrderStatusApi(id, status);
      toast.success("Updated ✅");
      fetchOrders();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Inventory2 /> Orders
        </h2>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400 text-sm" />
          <input
            placeholder="Search Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 pl-8 pr-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* 🔥 LIST */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] bg-gray-800 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No orders found 😕
        </p>
      ) : (
        <div className="space-y-5">
          {paginated.map((order) => (
            <div
              key={order._id}
              className="bg-[#020617] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-semibold text-sm tracking-wide">
                    {order._id}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  {order.status}
                </span>
              </div>

              {/* CUSTOMER */}
              <div className="mb-3 text-sm text-gray-300 space-y-1">
                <p className="flex items-center gap-1">
                  <Person fontSize="small" /> {order.userId?.name}
                </p>
                <p className="flex items-center gap-1">
                  <LocationOn fontSize="small" /> {order.address?.city}
                </p>
              </div>

              {/* PRODUCTS */}
              <div className="space-y-3 border-t border-gray-800 pt-3">
                {order.items?.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-3 items-center hover:bg-gray-900/40 p-2 rounded-lg transition"
                  >
                    <img
                      src={
                        item.productId?.images?.[0]?.url ||
                        "https://via.placeholder.com/60"
                      }
                      className="h-14 w-14 rounded object-cover border border-gray-700"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.productId?.title || "Product"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-green-400 font-semibold">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* ACTION */}
              {getNextStatuses(order.status).length > 0 && (
                <div className="mt-4 flex justify-between items-center border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Update fontSize="small" /> Update Status
                  </p>

                  <div className="flex gap-2">
                    <select
                      value={selectedStatus[order._id] || ""}
                      onChange={(e) =>
                        setSelectedStatus({
                          ...selectedStatus,
                          [order._id]: e.target.value,
                        })
                      }
                      className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-sm"
                    >
                      <option value="">Select</option>
                      {getNextStatuses(order.status).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleUpdate(order._id)}
                      disabled={updatingId === order._id}
                      className="bg-blue-600 px-4 py-1 rounded text-sm flex items-center gap-1 disabled:opacity-50"
                    >
                      {updatingId === order._id ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-400">
          Page {page}
        </span>

        <button
          disabled={start + limit >= filtered.length}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerOrders;