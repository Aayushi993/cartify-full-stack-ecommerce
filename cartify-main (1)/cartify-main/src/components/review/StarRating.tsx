import { useState } from "react";

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`cursor-pointer transition transform ${
            (hover || value) >= star
              ? "text-yellow-400 scale-110"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;