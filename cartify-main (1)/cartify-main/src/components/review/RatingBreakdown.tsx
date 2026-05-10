const RatingBreakdown = ({ reviews }: { reviews: any[] }) => {
  const total = reviews.length;

  const counts = [5, 4, 3, 2, 1].map(
    (r) => reviews.filter((rev) => rev.rating === r).length
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
      <h3 className="font-semibold text-lg">Rating Breakdown</h3>

      {counts.map((count, index) => {
        const star = 5 - index;
        const percent = total ? (count / total) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-8">{star}★</span>

            <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-yellow-400 h-2 rounded transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <span className="w-10 text-right text-gray-500">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingBreakdown;