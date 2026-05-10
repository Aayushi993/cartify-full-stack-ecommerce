import { useState } from "react";
import toast from "react-hot-toast";
import { deleteProductApi } from "../../services/product.api";

interface Product {
  _id: string;
  title: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  refresh: () => Promise<void>;
}

const DeleteModal = ({ open, onClose, product, refresh }: Props) => {
  const [loading, setLoading] = useState(false);

  if (!open || !product) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteProductApi(product._id);

      toast.success("Product deleted 🗑️");

      await refresh();
      onClose();
    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#020617] w-[400px] p-6 rounded-2xl shadow-xl space-y-4"
      >
        <h2 className="text-xl font-bold text-red-500">
          Delete Product ⚠️
        </h2>

        <p className="text-gray-300">
          Delete{" "}
          <span className="font-semibold text-white">
            {product.title}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;