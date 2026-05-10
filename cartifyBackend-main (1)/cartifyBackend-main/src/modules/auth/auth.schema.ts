import { z } from "zod";

export const authSchema = z
  .object({
    mode: z.enum(["login", "register"]),
    name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "register" && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Name is required for registration",
      });
    }
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});