// import { useEffect, useState } from "react";
// import { getMyOrdersApi } from "../../services/order.api";
// import { useNavigate } from "react-router-dom";

// interface Order {
//   _id: string;
//   status: string;
//   totalAmount: number;
//   items: any[];
//   createdAt: string;
// }
  
// const Orders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await getMyOrdersApi();
//         if (isMounted) setOrders(res ?? []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchOrders();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "DELIVERED":
//         return "bg-green-100 text-green-600";
//       case "SHIPPED":
//         return "bg-blue-100 text-blue-600";
//       case "PAID":
//         return "bg-yellow-100 text-yellow-600";
//       case "CANCELLED":
//         return "bg-red-100 text-red-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="max-w-[1000px] mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">My Orders 📦</h2>

//       {loading ? (
//         <p>Loading orders...</p>
//       ) : orders.length === 0 ? (
//         <div className="text-center py-10">
//           <p className="text-gray-500">No orders found 😕</p>
//         </div>
//       ) : (
//         <div className="space-y-5">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-xs text-gray-400">ORDER ID</p>
//                   <p className="font-semibold text-sm">{order._id}</p>
//                 </div>

//                 <span
//                   className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center border-t pt-3 mt-2">
//                 <div className="text-sm text-gray-600 space-y-1">
//                   <p>💰 Amount: ₹{order.totalAmount}</p>
//                   <p>📦 Items: {order.items?.length ?? 0}</p>
//                   <p className="text-xs text-gray-400">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => navigate(`/orders/${order._id}`)}
//                   className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../../services/order.api";
import { useNavigate } from "react-router-dom";
import {
  LocalShipping,
  CheckCircle,
  Cancel,
  AccessTime,
} from "@mui/icons-material";

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrdersApi();
        if (isMounted) setOrders(res ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🎨 STATUS STYLE + ICON
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return {
          color: "bg-green-100 text-green-600",
          icon: <CheckCircle fontSize="small" />,
        };
      case "SHIPPED":
        return {
          color: "bg-blue-100 text-blue-600",
          icon: <LocalShipping fontSize="small" />,
        };
      case "PAID":
        return {
          color: "bg-yellow-100 text-yellow-600",
          icon: <AccessTime fontSize="small" />,
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-600",
          icon: <Cancel fontSize="small" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-600",
          icon: <AccessTime fontSize="small" />,
        };
    }
  };

  // 🔥 LOADING SKELETON
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto p-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders 📦</h2>

        <button
          onClick={() => navigate("/")}
          className="text-sm text-primary font-medium hover:underline"
        >
          Continue Shopping →
        </button>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-lg text-gray-500 mb-4">
            No orders yet 😕
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const status = getStatusConfig(order.status);

            return (
              <div
                key={order._id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-4">

                  {/* LEFT */}
                  <div>
                    <p className="text-xs text-gray-400">
                      ORDER ID
                    </p>
                    <p className="font-semibold text-sm">
                      {order._id}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${status.color}`}
                  >
                    {status.icon}
                    {order.status}
                  </div>
                </div>

                {/* ITEMS PREVIEW */}
                <div className="flex items-center gap-3 mt-4 overflow-x-auto">
                  {order.items?.slice(0, 4).map((item: any, i) => (
                    <img
                      key={i}
                      src={
                        item.productId?.images?.[0]?.url ||
                        "https://via.placeholder.com/80"
                      }
                      className="w-14 h-14 object-cover rounded border"
                    />
                  ))}

                  {order.items?.length > 4 && (
                    <span className="text-sm text-gray-500">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>

                {/* BOTTOM */}
                <div className="flex justify-between items-center mt-4 border-t pt-3">

                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">
                      💰 ₹{order.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {order.items?.length} items
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;