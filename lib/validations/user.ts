import z from "zod";

export const createUserSchema = z.object({
  phoneNumber: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(["user", "admin"]),
});

export const updateUserSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  role: z.enum(["user", "admin"]),
  isActive: z.boolean(),
});
