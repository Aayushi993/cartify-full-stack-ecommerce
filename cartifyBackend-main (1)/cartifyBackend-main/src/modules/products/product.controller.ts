import { Request, Response } from "express";
import { productService } from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.schema";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { validateObjectId, toPositiveInt } from "../../utils/validators";

const parseProductBody = (body: any) => {
  const parsedData: any = { ...body };

  if (body.mrp !== undefined) {
    parsedData.mrp = Number(body.mrp);
  }

  if (body.sellingPrice !== undefined) {
    parsedData.sellingPrice = Number(body.sellingPrice);
  }

  if (body.quantity !== undefined) {
    parsedData.quantity = Number(body.quantity);
  }

  return parsedData;
};

export const productController = {
  async create(req: AuthRequest, res: Response) {
    const parsed = createProductSchema.parse(parseProductBody(req.body));
    const files = (req.files as Express.Multer.File[]) || [];

    const product = await productService.createProduct(
      parsed,
      files,
      req.user!.userId,
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },

  async update(req: AuthRequest, res: Response) {
    validateObjectId(req.params.id, "product id");

    const parsed = updateProductSchema.parse(parseProductBody(req.body));
    const files = (req.files as Express.Multer.File[]) || [];

    const product = await productService.updateProduct(
      req.params.id,
      req.user!.userId,
      req.user!.role,
      parsed,
      files,
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },

  async list(req: Request, res: Response) {
    const page = toPositiveInt(req.query.page, "page", 1);
    const limit = Math.min(toPositiveInt(req.query.limit, "limit", 12), 100);

    const products = await productService.listProducts({
      page,
      limit,
      search: req.query.search as string,
      category: req.query.category as string,
      sort: req.query.sort as string,
    });

    res.json({
      success: true,
      data: products,
    });
  },

  async myProducts(req: AuthRequest, res: Response) {
    const products = await productService.listSellerProducts(
      req.user!.userId,
      req.user!.role,
    );

    res.json({
      success: true,
      data: products,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    validateObjectId(req.params.id, "product id");

    await productService.deleteProduct(
      req.params.id,
      req.user!.userId,
      req.user!.role,
    );

    res.json({
      success: true,
      message: "Product disabled successfully",
    });
  },

  async getSingle(req: Request, res: Response) {
    validateObjectId(req.params.id, "product id");

    const product = await productService.getSingleProduct(req.params.id);

    res.json({
      success: true,
      data: product,
    });
  },
};