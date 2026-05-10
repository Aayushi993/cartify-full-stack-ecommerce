import { useState } from "react";
import { deleteReviewApi } from "../../services/review.api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const ReviewList = ({ reviews = [], refresh }: any) => {
  const [sort, setSort] = useState("newest");

  const { user, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      await deleteReviewApi(id);
      toast.success("Deleted 🗑");
      refresh();
    } catch {
      toast.error("Failed ❌");
    }
  };

  if (sortedReviews.length === 0) {
    return <p className="text-gray-500">No reviews yet 😕</p>;
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Customer Reviews</h3>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      {sortedReviews.map((r) => {
        const isOwner = r.userId?._id === (user?._id || user?.id);

        return (
          <div key={r._id} className="bg-white p-4 rounded-xl shadow-sm space-y-2">

            <div className="flex justify-between">
              <p className="font-semibold text-gray-800">
                {r.userId?.name}
              </p>

              {isLoggedIn && isOwner && (
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            {/* ⭐ Stars */}
            <div className="text-yellow-500 text-sm">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            <p className="text-gray-600 text-sm">{r.comment}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;