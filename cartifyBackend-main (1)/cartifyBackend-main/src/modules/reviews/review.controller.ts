import { Request, Response } from "express";
import { z } from "zod";
import { reviewService } from "./review.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { validateObjectId } from "../../utils/validators";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().default(""),
});

const updateReviewSchema = reviewSchema.partial().refine(
  (data) => data.rating !== undefined || data.comment !== undefined,
  {
    message: "Rating or comment is required",
  },
);

export const reviewController = {
  async add(req: AuthRequest, res: Response) {
    validateObjectId(req.params.productId, "product id");

    const { rating, comment } = reviewSchema.parse({
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });

    const review = await reviewService.addReview(
      req.params.productId,
      req.user!.userId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  },

  async list(req: Request, res: Response) {
    validateObjectId(req.params.productId, "product id");

    const reviews = await reviewService.getReviews(
      req.params.productId,
      req.query.sort as string,
    );

    res.json({
      success: true,
      data: reviews,
    });
  },

  async update(req: AuthRequest, res: Response) {
    validateObjectId(req.params.reviewId, "review id");

    const data = updateReviewSchema.parse({
      ...req.body,
      rating:
        req.body.rating !== undefined ? Number(req.body.rating) : undefined,
    });

    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.user!.userId,
      data,
    );

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    validateObjectId(req.params.reviewId, "review id");

    await reviewService.deleteReview(req.params.reviewId, req.user!.userId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  },
};