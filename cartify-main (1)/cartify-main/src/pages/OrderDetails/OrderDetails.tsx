// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getMyOrdersApi } from "../../services/order.api";
// import InvoicePreview from "../Invoice/InvoicePreview";

// interface OrderItem {
//   _id: string;
//   quantity: number;
//   price: number;
//   productId?: {
//     title?: string;
//     images?: { url: string }[];
//   };
// }

// interface Order {
//   _id: string;
//   status: string;
//   createdAt: string;
//   items: OrderItem[];
//   totalAmount: number;
//   address: {
//     fullName: string;
//     address: string;
//     city: string;
//     pincode: string;
//   };
// }

// const OrderDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showInvoice, setShowInvoice] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     let isMounted = true;

//     const loadOrder = async () => {
//       try {
//         setLoading(true);
//         const data = await getMyOrdersApi();

//         const found = data?.find((o: Order) => o._id === id);

//         if (isMounted) setOrder(found ?? null);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadOrder();

//     return () => {
//       isMounted = false;
//     };
//   }, [id]);

//   if (loading) {
//     return <div className="text-center mt-20">Loading order...</div>;
//   }

//   if (!order) {
//     return <div className="text-center mt-20">Order not found ❌</div>;
//   }

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
//     <div className="bg-gray-100 min-h-screen p-4 md:p-8">
//       <button
//         onClick={() => navigate("/orders")}
//         className="mb-4 text-primary font-semibold"
//       >
//         ← Back to Orders
//       </button>

//       <div className="max-w-[900px] mx-auto bg-white rounded-xl shadow p-6 space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="font-bold text-lg">Order #{order._id}</h2>
//             <p className="text-sm text-gray-500">
//               {new Date(order.createdAt).toLocaleString()}
//             </p>
//           </div>

//           <span className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
//             {order.status}
//           </span>
//         </div>

//         {/* ITEMS */}
//         <div>
//           <h3 className="font-semibold mb-3">Items</h3>

//           <div className="space-y-4">
//             {order.items.map((item) => {
//               const product = item.productId;

//               return (
//                 <div key={item._id} className="flex justify-between items-center border p-3 rounded-lg">
//                   <div className="flex gap-3 items-center">
//                     <img
//                       src={
//                         product?.images?.[0]?.url ??
//                         "https://dummyimage.com/80x80/ccc/000&text=No+Img"
//                       }
//                       alt="product"
//                       className="w-[60px] h-[60px] object-cover rounded"
//                     />

//                     <div>
//                       <p className="text-sm font-medium">
//                         {product?.title ?? "Product"}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                   </div>

//                   <p className="font-semibold">
//                     ₹{(item.price * item.quantity).toLocaleString()}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ADDRESS */}
//         <div>
//           <h3 className="font-semibold mb-2">Delivery Address</h3>
//           <div className="bg-gray-50 p-3 rounded text-sm">
//             {order.address.fullName} <br />
//             {order.address.address}, {order.address.city} <br />
//             {order.address.pincode}
//           </div>
//         </div>

//         {/* TOTAL */}
//         <div className="flex justify-between border-t pt-4">
//           <span className="font-semibold">Total</span>
//           <span className="font-bold text-green-600">
//             ₹{order.totalAmount.toLocaleString()}
//           </span>
//         </div>

//         <button
//           onClick={() => navigate("/")}
//           className="w-full bg-primary text-white py-2 rounded"
//         >
//           Continue Shopping
//         </button>

//         <button
//           onClick={() => setShowInvoice(true)}
//           className="w-full bg-green-600 text-white py-2 rounded mt-3"
//         >
//           View Invoice 🧾
//         </button>

//         {showInvoice && (
//           <InvoicePreview
//             order={order}
//             onClose={() => setShowInvoice(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../../services/order.api";
import InvoicePreview from "../Invoice/InvoicePreview";
import {
  LocalShipping,
  CheckCircle,
  Cancel,
  AccessTime,
} from "@mui/icons-material";

interface OrderItem {
  _id: string;
  quantity: number;
  price: number;
  productId?: {
    title?: string;
    images?: { url: string }[];
  };
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  address: {
    fullName: string;
    address: string;
    city: string;
    pincode: string;
  };
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await getMyOrdersApi();
        const found = data?.find((o: Order) => o._id === id);
        setOrder(found ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // 🎨 STATUS CONFIG
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

  // 🧠 ORDER TIMELINE
  const timeline = [
    "PLACED",
    "PAID",
    "SHIPPED",
    "DELIVERED",
  ];

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto mt-20 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (!order) {
    return <div className="text-center mt-20">Order not found ❌</div>;
  }

  const status = getStatusConfig(order.status);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      {/* BACK */}
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-primary font-semibold"
      >
        ← Back to Orders
      </button>

      <div className="max-w-[1100px] mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* HEADER */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">
                  Order #{order._id}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${status.color}`}
              >
                {status.icon}
                {order.status}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="flex justify-between mt-6 text-xs">
              {timeline.map((step, i) => {
                const active =
                  timeline.indexOf(order.status) >= i;

                return (
                  <div key={step} className="text-center flex-1">
                    <div
                      className={`w-6 h-6 mx-auto rounded-full ${
                        active ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                    <p className="mt-1">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Items</h3>

            <div className="space-y-4">
              {order.items.map((item) => {
                const product = item.productId;

                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border p-3 rounded-lg hover:shadow-sm transition"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={
                          product?.images?.[0]?.url ??
                          "https://via.placeholder.com/80"
                        }
                        className="w-[70px] h-[70px] object-cover rounded"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {product?.title ?? "Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">
              Delivery Address
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
              <p className="font-semibold">
                {order.address.fullName}
              </p>
              <p>
                {order.address.address}, {order.address.city}
              </p>
              <p>{order.address.pincode}</p>
            </div>
          </div>
        </div>

        {/* RIGHT (STICKY SUMMARY) */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-[90px] space-y-4">

          <h3 className="font-semibold">Order Summary</h3>

          <div className="flex justify-between text-sm">
            <span>Items</span>
            <span>{order.items.length}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <hr />

          <div className="flex justify-between font-bold text-lg text-green-600">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setShowInvoice(true)}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            View Invoice 🧾
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary text-white py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* INVOICE */}
      {showInvoice && (
        <InvoicePreview
          order={order}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default OrderDetails;