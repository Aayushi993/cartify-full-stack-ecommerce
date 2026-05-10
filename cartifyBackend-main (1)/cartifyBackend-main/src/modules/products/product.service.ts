import fs from "fs";
import path from "path";
import cloudinary from "../../config/cloudinary";
import { AppError } from "../../utils/AppError";
import { Product } from "./product.model";
import { v4 as uuidv4 } from "uuid";

type UploadedImage = {
  url: string;
  publicId: string;
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes("your_") &&
    !process.env.CLOUDINARY_API_KEY.includes("your_") &&
    !process.env.CLOUDINARY_API_SECRET.includes("your_")
  );
};

const uploadImageLocally = async (
  file: Express.Multer.File,
): Promise<UploadedImage> => {
  const uploadDir = path.join(process.cwd(), "uploads", "products");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const mimeExtensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const extension = mimeExtensionMap[file.mimetype] || "png";
  const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `http://localhost:${process.env.PORT || 5000}/uploads/products/${fileName}`,
    publicId: `local:${fileName}`,
  };
};

const uploadImageToCloudinary = async (
  file: Express.Multer.File,
): Promise<UploadedImage> => {
  if (!isCloudinaryConfigured()) {
    return uploadImageLocally(file);
  }

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "products" }, (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }

        resolve(result);
      })
      .end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const deleteImage = async (image: UploadedImage) => {
  if (!image.publicId) return;

  if (image.publicId.startsWith("local:")) {
    const fileName = image.publicId.replace("local:", "");
    const filePath = path.join(process.cwd(), "uploads", "products", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return;
  }

  if (isCloudinaryConfigured()) {
    await cloudinary.uploader.destroy(image.publicId);
  }
};

const generateUniqueSKU = async () => {
  let sku = "";

  while (!sku) {
    const generatedSku = `SKU-${uuidv4().split("-")[0].toUpperCase()}`;
    const found = await Product.findOne({ sku: generatedSku });

    if (!found) {
      sku = generatedSku;
    }
  }

  return sku;
};

const buildProductOwnerQuery = (
  productId: string,
  userId: string,
  role: string,
) => {
  const query: any = {
    _id: productId,
    isActive: true,
  };

  if (role !== "SUPER_ADMIN") {
    query.sellerId = userId;
  }

  return query;
};

const normalizeCategory = (category?: string) => {
  if (!category) return category;

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

  return categories.find(
    (item) => item.toLowerCase() === category.toLowerCase(),
  );
};

export const productService = {
  async createProduct(
    data: any,
    files: Express.Multer.File[] = [],
    sellerId: string,
  ) {
    const uploadedImages: UploadedImage[] = [];

    try {
      for (const file of files) {
        const uploadedImage = await uploadImageToCloudinary(file);
        uploadedImages.push(uploadedImage);
      }

      const product = await Product.create({
        ...data,
        sku: await generateUniqueSKU(),
        images: uploadedImages,
        sellerId,
        stockStatus: data.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        isActive: true,
      });

      return product;
    } catch (error) {
      for (const image of uploadedImages) {
        await deleteImage(image);
      }

      throw error;
    }
  },

  async updateProduct(
    productId: string,
    userId: string,
    role: string,
    data: any,
    files: Express.Multer.File[] = [],
  ) {
    const product = await Product.findOne(
      buildProductOwnerQuery(productId, userId, role),
    );

    if (!product) {
      throw new AppError("Product not found or unauthorized", 404);
    }

    const oldImages = product.images || [];
    const newUploadedImages: UploadedImage[] = [];

    try {
      Object.assign(product, data);

      if (files.length > 0) {
        for (const file of files) {
          const uploadedImage = await uploadImageToCloudinary(file);
          newUploadedImages.push(uploadedImage);
        }

        product.images = newUploadedImages;
      }

      if (data.quantity !== undefined) {
        product.stockStatus = data.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
      }

      await product.save();

      if (files.length > 0) {
        for (const image of oldImages) {
          await deleteImage(image);
        }
      }

      return product;
    } catch (error) {
      for (const image of newUploadedImages) {
        await deleteImage(image);
      }

      throw error;
    }
  },

  async listProducts(options: any) {
    const { page, limit, search, category, sort } = options;

    const query: any = {
      isActive: true,
    };

    if (search) {
      const safeSearch = escapeRegex(search.trim());

      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { brand: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category) {
      const normalizedCategory = normalizeCategory(category);

      if (normalizedCategory) {
        query.category = normalizedCategory;
      } else {
        query.category = category;
      }
    }

    let sortOption: any = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { sellingPrice: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { sellingPrice: -1 };
    }

    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async listSellerProducts(userId: string, role: string) {
    const query: any = {
      isActive: true,
    };

    if (role !== "SUPER_ADMIN") {
      query.sellerId = userId;
    }

    return Product.find(query).sort({ createdAt: -1 });
  },

  async deleteProduct(productId: string, userId: string, role: string) {
    const product = await Product.findOne(
      buildProductOwnerQuery(productId, userId, role),
    );

    if (!product) {
      throw new AppError("Product not found or unauthorized", 404);
    }

    product.isActive = false;
    product.stockStatus = "OUT_OF_STOCK";
    product.quantity = 0;

    await product.save();

    return true;
  },

  async getSingleProduct(productId: string) {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  },
};