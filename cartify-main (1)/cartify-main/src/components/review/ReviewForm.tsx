import { useState } from "react";
import toast from "react-hot-toast";
import { addReviewApi } from "../../services/review.api";
import StarRating from "./StarRating";

export const ReviewForm = ({
  productId,
  onSuccess,
  reviews,
  userId,
}: any) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const alreadyReviewed = reviews.some(
    (r: any) => (r.userId?._id || r.userId) === userId
  );

  if (alreadyReviewed) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
        ✅ You already reviewed this product
      </div>
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Write something ✍️");
      return;
    }

    try {
      setLoading(true);
      await addReviewApi(productId, { rating, comment });

      toast.success("Review added ✅");
      setComment("");
      setRating(5);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white border p-5 rounded-xl shadow-sm space-y-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold text-lg">Write a Review ✍️</h3>

      <StarRating value={rating} onChange={setRating} />

      <textarea
        placeholder="Share your experience..."
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};