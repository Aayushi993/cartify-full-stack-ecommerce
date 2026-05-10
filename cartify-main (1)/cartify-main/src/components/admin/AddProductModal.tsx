import { useState, useEffect } from "react";
import { createProductApi, updateProductApi } from "../../services/product.api";
import toast from "react-hot-toast";

const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
  "Other",
];

const AddProductModal = ({ open, onClose, refresh, editData }: any) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    category: "Electronics",
    description: "",
    mrp: "",
    sellingPrice: "",
    quantity: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        brand: editData.brand || "",
        category: editData.category || "Electronics",
        description: editData.description || "",
        mrp: String(editData.mrp ?? ""),
        sellingPrice: String(editData.sellingPrice ?? ""),
        quantity: String(editData.quantity ?? ""),
      });

      setPreview(editData.images?.map((img: any) => img.url) || []);
      setImages([]);
    } else {
      setForm({
        title: "",
        brand: "",
        category: "Electronics",
        description: "",
        mrp: "",
        sellingPrice: "",
        quantity: "",
      });

      setPreview([]);
      setImages([]);
    }
  }, [editData, open]);

  if (!open) return null;

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Product title is required");
      return false;
    }

    if (!form.brand.trim()) {
      toast.error("Brand is required");
      return false;
    }

    if (!form.description.trim() || form.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }

    const mrp = Number(form.mrp);
    const sellingPrice = Number(form.sellingPrice);
    const quantity = Number(form.quantity);

    if (!mrp || mrp <= 0) {
      toast.error("MRP must be greater than 0");
      return false;
    }

    if (!sellingPrice || sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }

    if (sellingPrice > mrp) {
      toast.error("Selling price cannot be greater than MRP");
      return false;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      toast.error("Quantity must be 0 or more");
      return false;
    }

    if (!editData && images.length < 2) {
      toast.error("Please upload at least 2 product images");
      return false;
    }

    if (images.length > 4) {
      toast.error("Maximum 4 product images allowed");
      return false;
    }

    return true;
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFile) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      e.target.value = "";
      return;
    }

    const tooLarge = selectedFiles.find(
      (file) => file.size > 3 * 1024 * 1024,
    );

    if (tooLarge) {
      toast.error("Each image must be less than 3MB");
      e.target.value = "";
      return;
    }

    const mergedFiles = [...images, ...selectedFiles];

    if (mergedFiles.length > 4) {
      toast.error("Maximum 4 images allowed");
      e.target.value = "";
      return;
    }

    setImages(mergedFiles);

    const urls = mergedFiles.map((file) => URL.createObjectURL(file));
    setPreview(urls);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreview = preview.filter((_, i) => i !== index);

    setImages(updatedImages);
    setPreview(updatedPreview);
  };

  const buildFormData = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    return formData;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = buildFormData();

      if (editData) {
        await updateProductApi(editData._id, formData);
        toast.success("Product updated ✏️");
      } else {
        await createProductApi(formData);
        toast.success("Product added 🚀");
      }

      await refresh();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Product save failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#020617] w-[520px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xl font-bold">
          {editData ? "Edit Product ✏️" : "Add Product 🚀"}
        </h2>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          placeholder="Brand"
          className="w-full p-2 bg-gray-800 rounded"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 bg-gray-800 rounded"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
          className="w-full p-2 bg-gray-800 rounded min-h-[90px]"
        />

        <div className="flex gap-2">
          <input
            type="number"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="MRP"
            className="w-full p-2 bg-gray-800 rounded"
          />

          <input
            type="number"
            value={form.sellingPrice}
            onChange={(e) =>
              setForm({ ...form, sellingPrice: e.target.value })
            }
            placeholder="Selling Price"
            className="w-full p-2 bg-gray-800 rounded"
          />
        </div>

        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Quantity"
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImage}
        />

        <p className="text-xs text-gray-400">
          Upload 2 to 4 images. Allowed: JPG, PNG, WEBP. Each image max 3MB.
          You can select multiple images together or choose again to add more.
        </p>

        <div className="flex gap-2 flex-wrap">
          {preview.length > 0 ? (
            preview.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="h-16 w-16 object-cover rounded border"
                />

                {!editData && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No image selected</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;