// import { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   createPaymentApi,
//   confirmPaymentApi,
// } from "../../services/payment.api";
// import toast from "react-hot-toast";

// type Step = "FORM" | "OTP" | "PROCESSING" | "SUCCESS" | "FAILED";

// interface Order {
//   _id: string;
//   totalAmount: number;
// }

// interface LocationState {
//   order?: Order;
// }

// const Payment = () => {
//   const [step, setStep] = useState<Step>("FORM");
//   const [otp, setOtp] = useState("");
//   const [generatedOtp, setGeneratedOtp] = useState("");
//   const [paymentId, setPaymentId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [method, setMethod] = useState("UPI");
//   const [upi, setUpi] = useState("");

//   const location = useLocation();
//   const navigate = useNavigate();

//   const successSound = useRef<HTMLAudioElement | null>(null);

//   const state = location.state as LocationState;
//   const order = state?.order;

//   // 🔊 init audio once
//   useEffect(() => {
//     successSound.current = new Audio("/sounds/success.mp3");
//   }, []);

//   // 🔥 init payment
//   useEffect(() => {
//     if (!order) return;

//     let isMounted = true;

//     const initPayment = async () => {
//       try {
//         const payment = await createPaymentApi(order._id);
//         if (isMounted) {
//           setPaymentId(payment._id);
//         }
//       } catch {
//         toast.error("Payment init failed ❌");
//       }
//     };

//     initPayment();

//     return () => {
//       isMounted = false;
//     };
//   }, [order]);

//   if (!order) {
//     return <p className="text-center mt-20">No order found ❌</p>;
//   }

//   const handlePayment = () => {
//     if (method === "UPI" && !upi) {
//       return toast.error("Enter UPI ID");
//     }

//     const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();

//     setGeneratedOtp(fakeOtp);
//     setOtp("");
//     setStep("OTP");

//     console.log("OTP:", fakeOtp);

//     toast.success("OTP sent (check console 😄)");
//   };

//   const handleConfirmOtp = async () => {
//     if (!paymentId) {
//       return toast.error("Payment not initialized ❌");
//     }

//     if (otp !== generatedOtp) {
//       return toast.error("Invalid OTP ❌");
//     }

//     try {
//       setLoading(true);
//       setStep("PROCESSING");

//       const res = await confirmPaymentApi(paymentId, method);

//       if (res.status === "SUCCESS") {
//         successSound.current?.play();

//         setStep("SUCCESS");

//         setTimeout(() => {
//           navigate("/order-success", {
//             state: { ...order, status: "PAID" },
//           });
//         }, 2000);
//       } else {
//         setStep("FAILED");
//       }
//     } catch {
//       setStep("FAILED");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔄 UI STATES

//   if (step === "PROCESSING") {
//     return (
//       <div className="flex flex-col items-center justify-center mt-40">
//         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//         <p className="mt-4 text-lg font-semibold">
//           Processing Payment...
//         </p>
//       </div>
//     );
//   }

//   if (step === "SUCCESS") {
//     return (
//       <div className="flex flex-col items-center justify-center mt-40">
//         <div className="text-5xl animate-pop">✅</div>
//         <h2 className="text-xl font-bold mt-4">
//           Payment Successful
//         </h2>
//       </div>
//     );
//   }

//   if (step === "FAILED") {
//     return (
//       <div className="flex flex-col items-center justify-center mt-40">
//         <div className="text-5xl animate-pop">❌</div>
//         <h2 className="text-xl font-bold mt-4">
//           Payment Failed
//         </h2>
//         <button
//           onClick={() => setStep("FORM")}
//           className="mt-4 bg-primary text-white px-4 py-2 rounded"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[500px] mx-auto mt-20 p-6 bg-white rounded-xl shadow">
//       <h2 className="text-xl font-bold text-center mb-4">
//         Complete Payment 💳
//       </h2>

//       <div className="text-center mb-6">
//         <p className="text-gray-500">Order ID</p>
//         <p className="font-semibold">{order._id}</p>

//         <p className="mt-3 text-gray-500">Total Amount</p>
//         <p className="text-2xl font-bold">
//           ₹{order.totalAmount}
//         </p>
//       </div>

//       {/* METHOD */}
//       <div className="mb-4">
//         <label className="block mb-2 font-semibold">
//           Select Method
//         </label>

//         <select
//           className="w-full border p-2 rounded"
//           value={method}
//           onChange={(e) => setMethod(e.target.value)}
//         >
//           <option value="UPI">UPI</option>
//           <option value="CARD">Card</option>
//           <option value="COD">Cash on Delivery</option>
//         </select>
//       </div>

//       {/* UPI */}
//       {method === "UPI" && (
//         <input
//           type="text"
//           placeholder="Enter UPI ID (test@upi)"
//           className="w-full border p-2 rounded mb-4"
//           value={upi}
//           onChange={(e) => setUpi(e.target.value)}
//         />
//       )}

//       {step === "FORM" ? (
//         <button
//           onClick={handlePayment}
//           disabled={loading || !paymentId}
//           className="w-full bg-primary text-white py-3 rounded-lg disabled:opacity-50"
//         >
//           Pay Now
//         </button>
//       ) : (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             className="w-full border p-2 rounded mb-4"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />

//           <button
//             onClick={handleConfirmOtp}
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50"
//           >
//             Verify & Pay
//           </button>
//         </>
//       )}

//       <button
//         onClick={() => navigate("/")}
//         className="w-full mt-3 text-gray-500"
//       >
//         Cancel Payment
//       </button>
//     </div>
//   );
// };

// export default Payment;
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createPaymentApi,
  confirmPaymentApi,
} from "../../services/payment.api";
import toast from "react-hot-toast";
import {
  AccountBalanceWallet,
  CreditCard,
  LocalShipping,
} from "@mui/icons-material";

type Step = "FORM" | "OTP" | "PROCESSING" | "SUCCESS" | "FAILED";

interface Order {
  _id: string;
  totalAmount: number;
}

interface LocationState {
  order?: Order;
}

const Payment = () => {
  const [step, setStep] = useState<Step>("FORM");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);

  const [method, setMethod] = useState("UPI");
  const [upi, setUpi] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const successSound = useRef<HTMLAudioElement | null>(null);

  const state = location.state as LocationState;
  const order = state?.order;

  useEffect(() => {
    successSound.current = new Audio("/sounds/success.mp3");
  }, []);

  useEffect(() => {
    if (!order) return;

    const initPayment = async () => {
      try {
        const payment = await createPaymentApi(order._id);
        setPaymentId(payment._id);
      } catch {
        toast.error("Payment init failed ❌");
      }
    };

    initPayment();
  }, [order]);

  if (!order) {
    return <p className="text-center mt-20">No order found ❌</p>;
  }

  // 🧠 STEP PROGRESS
  const StepIndicator = () => (
    <div className="flex justify-between mb-6 text-sm">
      {["Payment", "OTP", "Done"].map((s, i) => (
        <div key={i} className="flex-1 text-center relative">
          <div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
              (step === "FORM" && i === 0) ||
              (step === "OTP" && i <= 1) ||
              (step === "SUCCESS" && i <= 2)
                ? "bg-primary"
                : "bg-gray-300"
            }`}
          >
            {i + 1}
          </div>
          <p className="mt-1">{s}</p>
        </div>
      ))}
    </div>
  );

  // 🔥 PAYMENT START
  const handlePayment = () => {
    if (method === "UPI" && !upi) {
      return toast.error("Enter UPI ID");
    }

    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedOtp(fakeOtp);
    setOtp("");
    setStep("OTP");

    console.log("OTP:", fakeOtp);
    toast.success("OTP sent 📲");
  };

  const handleConfirmOtp = async () => {
    if (!paymentId) return toast.error("Payment not initialized ❌");

    if (otp !== generatedOtp) {
      return toast.error("Invalid OTP ❌");
    }

    try {
      setLoading(true);
      setStep("PROCESSING");

      const res = await confirmPaymentApi(paymentId, method);

      if (res.status === "SUCCESS") {
        successSound.current?.play();
        setStep("SUCCESS");

        setTimeout(() => {
          navigate("/orders", {
            state: { ...order, status: "PAID" },
          });
        }, 2000);
      } else {
        setStep("FAILED");
      }
    } catch {
      setStep("FAILED");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 STATES

  if (step === "PROCESSING") {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg font-semibold">Processing...</p>
      </div>
    );
  }

  if (step === "SUCCESS") {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="text-6xl animate-bounce">✅</div>
        <h2 className="text-xl font-bold mt-4">
          Payment Successful 🎉
        </h2>
      </div>
    );
  }

  if (step === "FAILED") {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="text-6xl">❌</div>
        <h2 className="text-xl font-bold mt-4">Payment Failed</h2>
        <button
          onClick={() => setStep("FORM")}
          className="mt-4 bg-primary text-white px-5 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg space-y-6">

      <StepIndicator />

      {/* ORDER */}
      <div className="text-center">
        <p className="text-gray-500">Order ID</p>
        <p className="font-semibold">{order._id}</p>

        <p className="mt-3 text-gray-500">Amount</p>
        <p className="text-3xl font-bold text-primary">
          ₹{order.totalAmount}
        </p>
      </div>

      {/* METHOD CARDS */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "UPI", icon: <AccountBalanceWallet />, label: "UPI" },
          { key: "CARD", icon: <CreditCard />, label: "Card" },
          { key: "COD", icon: <LocalShipping />, label: "COD" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setMethod(m.key)}
            className={`border p-3 rounded-lg flex flex-col items-center gap-1 transition ${
              method === m.key
                ? "border-primary bg-primary/10"
                : "hover:border-primary"
            }`}
          >
            {m.icon}
            <span className="text-sm">{m.label}</span>
          </button>
        ))}
      </div>

      {/* UPI INPUT */}
      {method === "UPI" && (
        <input
          type="text"
          placeholder="Enter UPI ID"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
        />
      )}

      {/* FORM / OTP */}
      {step === "FORM" ? (
        <button
          onClick={handlePayment}
          disabled={!paymentId}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90"
        >
          Pay Now →
        </button>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-3 rounded-lg text-center tracking-widest text-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleConfirmOtp}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Verify & Pay
          </button>

          <button
            onClick={handlePayment}
            className="text-sm text-primary underline"
          >
            Resend OTP
          </button>
        </div>
      )}

      {/* CANCEL */}
      <button
        onClick={() => navigate("/")}
        className="w-full text-gray-500 text-sm"
      >
        Cancel Payment
      </button>
    </div>
  );
};

export default Payment;