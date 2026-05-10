import { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import { applySellerApi } from "../../services/seller.api";

const steps = ["Basic Info", "Business Info", "Address", "Review"];

interface SellerRequest {
  storeName?: string;
  sellerType?: "individual" | "business";
  gstNumber?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

interface Props {
  onSuccess: () => void;
  request?: SellerRequest | null;
}

const SellerForm = ({ onSuccess, request }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    sellerType: "individual" as "individual" | "business",
    gstNumber: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (request) {
      setForm({
        storeName: request.storeName ?? "",
        sellerType: request.sellerType ?? "individual",
        gstNumber: request.gstNumber ?? "",
        address: request.address ?? "",
        city: request.city ?? "",
        pincode: request.pincode ?? "",
      });
    }
  }, [request]);

  const handleNext = () => {
    if (activeStep === 0 && !form.storeName.trim()) {
      return toast.error("Store name required");
    }

    if (
      activeStep === 1 &&
      form.sellerType === "business" &&
      !form.gstNumber.trim()
    ) {
      return toast.error("GST required for business");
    }

    if (
      activeStep === 2 &&
      (!form.address || !form.city || !form.pincode)
    ) {
      return toast.error("Fill all address fields");
    }

    if (activeStep === 2 && !/^\d{6}$/.test(form.pincode)) {
      return toast.error("Invalid pincode ❌");
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await applySellerApi(form);

      toast.success("Application submitted 🚀");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Become a Seller 🚀
      </h2>

      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-6">
        {activeStep === 0 && (
          <div className="space-y-4">
            <TextField
              label="Store Name"
              fullWidth
              value={form.storeName}
              onChange={(e) =>
                setForm({ ...form, storeName: e.target.value })
              }
            />

            <Select
              fullWidth
              value={form.sellerType}
              onChange={(e) =>
                setForm({
                  ...form,
                  sellerType: e.target.value as "individual" | "business",
                })
              }
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </Select>
          </div>
        )}

        {activeStep === 1 &&
          (form.sellerType === "business" ? (
            <TextField
              label="GST Number"
              fullWidth
              value={form.gstNumber}
              onChange={(e) =>
                setForm({ ...form, gstNumber: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-500 text-center">
              No additional info required 👍
            </p>
          ))}

        {activeStep === 2 && (
          <div className="space-y-4">
            <TextField
              label="Address"
              fullWidth
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <TextField
              label="City"
              fullWidth
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <TextField
              label="Pincode"
              fullWidth
              value={form.pincode}
              onChange={(e) =>
                setForm({ ...form, pincode: e.target.value })
              }
            />
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-2 text-sm">
            <p><b>Store:</b> {form.storeName}</p>
            <p><b>Type:</b> {form.sellerType}</p>
            {form.gstNumber && <p><b>GST:</b> {form.gstNumber}</p>}
            <p><b>Address:</b> {form.address}</p>
            <p><b>City:</b> {form.city}</p>
            <p><b>Pincode:</b> {form.pincode}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit 🚀"}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default SellerForm;