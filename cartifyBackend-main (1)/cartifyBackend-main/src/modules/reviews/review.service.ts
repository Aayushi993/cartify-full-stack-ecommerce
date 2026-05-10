import mongoose from "mongoose";
import { Review } from "./review.model";
import { Product } from "../products/product.model";
import { AppError } from "../../utils/AppError";

const recalculateProductRating = async (productId: string) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const product = await Product.findById(productId);

  if (!product) {
    return;
  }

  if (stats.length === 0) {
    product.rating = 0;
    product.reviewCount = 0;
  } else {
    product.rating = Number(stats[0].averageRating.toFixed(1));
    product.reviewCount = stats[0].reviewCount;
  }

  await product.save();
};

export const reviewService = {
  async addReview(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const existingReview = await Review.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingReview) {
      throw new AppError("You have already reviewed this product", 409);
    }

    const review = await Review.create({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
    });

    await recalculateProductRating(productId);

    return review.populate("userId", "name email");
  },

  async getReviews(productId: string, sort = "newest") {
    const sortOption: any =
      sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    return Review.find({
      productId: new mongoose.Types.ObjectId(productId),
    })
      .populate("userId", "name email")
      .sort(sortOption);
  },

  async updateReview(
    reviewId: string,
    userId: string,
    data: {
      rating?: number;
      comment?: string;
    },
  ) {
    const review = await Review.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!review) {
      throw new AppError("Review not found or unauthorized", 404);
    }

    if (data.rating !== undefined) {
      review.rating = data.rating;
    }

    if (data.comment !== undefined) {
      review.comment = data.comment;
    }

    await review.save();

    await recalculateProductRating(review.productId.toString());

    return review.populate("userId", "name email");
  },

  async deleteReview(reviewId: string, userId: string) {
    const review = await Review.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!review) {
      throw new AppError("Review not found or unauthorized", 404);
    }

    const productId = review.productId.toString();

    await review.deleteOne();

    await recalculateProductRating(productId);

    return true;
  },
};