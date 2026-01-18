import z from "zod";

export const UserSchema = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
