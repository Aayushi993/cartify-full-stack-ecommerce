// import { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

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
//   createdAt: string;
//   status: string;
//   totalAmount: number;
//   address: {
//     fullName: string;
//     address: string;
//     city: string;
//     pincode: string;
//   };
//   items: OrderItem[];
// }

// interface Props {
//   order: Order;
//   onClose: () => void;
// }

// const InvoicePreview = ({ order, onClose }: Props) => {
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   const invoiceNo = `INV-${order._id.slice(-6).toUpperCase()}`;

//   const downloadPDF = async () => {
//     if (!invoiceRef.current) return;

//     const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgWidth = 210;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//     pdf.save(`Invoice-${invoiceNo}.pdf`);
//   };

//   const subtotal = order.totalAmount;
//   const gst = Math.round(subtotal * 0.18);
//   const cgst = gst / 2;
//   const sgst = gst / 2;
//   const total = subtotal + gst;

//   return (
//     <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
//       <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-2xl">
//         <button onClick={onClose} className="absolute top-4 right-4">
//           ✕
//         </button>

//         <div ref={invoiceRef} className="p-6 bg-white relative">
//           {/* HEADER */}
//           <div className="flex justify-between border-b pb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-blue-600">CartiFy</h1>
//               <p className="text-sm text-gray-500">Indore, India</p>
//             </div>

//             <div className="text-right text-sm">
//               <p className="font-semibold text-lg">INVOICE</p>
//               <p>{invoiceNo}</p>
//               <p>{order._id}</p>
//             </div>
//           </div>

//           {/* ITEMS */}
//           <table className="w-full mt-6 text-sm border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>Qty</th>
//                 <th>Total</th>
//               </tr>
//             </thead>

//             <tbody>
//               {(order.items ?? []).map((item, i) => (
//                 <tr key={item._id} className="text-center">
//                   <td>{i + 1}</td>
//                   <td>{item.productId?.title ?? "Product"}</td>
//                   <td>{item.quantity}</td>
//                   <td>₹{item.price * item.quantity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* TOTAL */}
//           <div className="mt-6 text-right space-y-1">
//             <p>Subtotal: ₹{subtotal}</p>
//             <p>CGST (9%): ₹{cgst}</p>
//             <p>SGST (9%): ₹{sgst}</p>
//             <p className="font-bold text-lg border-t pt-2">Total: ₹{total}</p>
//           </div>
//         </div>

//         <button
//           onClick={downloadPDF}
//           className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InvoicePreview;
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  createdAt: string;
  status: string;
  totalAmount: number;
  address: {
    fullName: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
}

interface Props {
  order: Order;
  onClose: () => void;
}

const InvoicePreview = ({ order, onClose }: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceNo = `INV-${order._id.slice(-6).toUpperCase()}`;

  // 🧠 BETTER PDF EXPORT
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    // 🔥 HANDLE MULTI PAGE
    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save(`Invoice-${invoiceNo}.pdf`);
  };

  const subtotal = order.totalAmount;
  const gst = Math.round(subtotal * 0.18);
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600"
        >
          ✕
        </button>

        {/* INVOICE */}
        <div ref={invoiceRef} className="p-8 text-sm">

          {/* HEADER */}
          <div className="flex justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                CartiFy
              </h1>
              <p className="text-gray-500">
                Indore, Madhya Pradesh, India
              </p>
              <p className="text-gray-400 text-xs">
                GSTIN: 22AAAAA0000A1Z5
              </p>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold">INVOICE</p>
              <p>Invoice No: {invoiceNo}</p>
              <p>Order ID: {order._id}</p>
              <p>
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* BILLING */}
          <div className="flex justify-between mt-6">
            <div>
              <p className="font-semibold mb-1">Bill To:</p>
              <p>{order.address.fullName}</p>
              <p>{order.address.address}</p>
              <p>
                {order.address.city} - {order.address.pincode}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold mb-1">Payment Status:</p>
              <p className="text-green-600 font-medium">
                {order.status}
              </p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="w-full mt-6 border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border text-center">Qty</th>
                <th className="p-2 border text-right">Price</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, i) => (
                <tr key={item._id}>
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">
                    {item.productId?.title ?? "Product"}
                  </td>
                  <td className="p-2 border text-center">
                    {item.quantity}
                  </td>
                  <td className="p-2 border text-right">
                    ₹{item.price}
                  </td>
                  <td className="p-2 border text-right">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="mt-6 flex justify-end">
            <div className="w-[300px] space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>CGST (9%)</span>
                <span>₹{cgst}</span>
              </div>

              <div className="flex justify-between">
                <span>SGST (9%)</span>
                <span>₹{sgst}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2 text-lg">
                <span>Total</span>
                <span>₹{total}</span> 
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-10 text-center text-xs text-gray-500 border-t pt-4">
            Thank you for shopping with CartiFy ❤️
          </div>
        </div>

        {/* ACTION */}
        <div className="p-4 border-t">
          <button
            onClick={downloadPDF}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90"
          >
            Download Invoice PDF 📄
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;