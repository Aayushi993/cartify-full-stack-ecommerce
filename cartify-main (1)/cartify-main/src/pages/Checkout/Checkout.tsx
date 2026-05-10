import { useEffect, useState } from "react";
import { createOrderApi } from "../../services/order.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { LocationOn, Person } from "@mui/icons-material";

interface Address {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);

  const [address, setAddress] = useState<Address>({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("addresses");

    if (stored) {
      try {
        setSavedAddresses(JSON.parse(stored));
      } catch {
        localStorage.removeItem("addresses");
      }
    }
  }, []);

  const saveAddress = (newAddress: Address) => {
    const updated = [newAddress, ...savedAddresses];
    setSavedAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const handleChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    if (!address.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (address.fullName.trim().length < 2) {
      toast.error("Full name must be at least 2 characters");
      return false;
    }

    if (!address.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (address.address.trim().length < 3) {
      toast.error("Address must be at least 3 characters");
      return false;
    }

    if (!address.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (address.city.trim().length < 2) {
      toast.error("City must be at least 2 characters");
      return false;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      toast.error("Pincode must be exactly 6 digits");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const cleanedAddress = {
        fullName: address.fullName.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        pincode: address.pincode.trim(),
      };

      const order = await createOrderApi(cleanedAddress);

      saveAddress(cleanedAddress);

      toast.success("Order placed 🎉");

      navigate("/payment", { state: { order } });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Order failed ❌",
      );
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* LEFT */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LocationOn /> Delivery Address
        </h2>

        {savedAddresses.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              Saved Addresses
            </p>

            <div className="flex flex-col gap-2">
              {savedAddresses.map((addr, index) => (
                <button
                  key={`${addr.pincode}-${index}`}
                  onClick={() => setAddress(addr)}
                  className="text-left border p-3 rounded-lg hover:border-primary transition"
                  type="button"
                >
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {addr.address}, {addr.city} - {addr.pincode}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Person className="absolute left-3 top-3 text-gray-400" />
            <input
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full border pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <textarea
            placeholder="Full Address"
            value={address.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />

            <input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold ${
            loading
              ? "bg-gray-300"
              : "bg-primary text-white hover:opacity-90"
          }`}
        >
          {loading ? "Placing Order..." : "Continue to Payment →"}
        </button>
      </div>

      {/* RIGHT */}
      <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-[90px] space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <div className="space-y-3 max-h-[300px] overflow-auto">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/100?text=No+Image";
                  }}
                  className="w-14 h-14 object-cover rounded"
                />

                <div className="flex-1 text-sm">
                  <p className="line-clamp-1">{item.title}</p>
                  <p className="text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>

                <p className="font-semibold text-sm">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))
          )}
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <p className="text-xs text-gray-500">
          Safe & secure payments 🔒
        </p>
      </div>
    </div>
  );
};

export default Checkout;