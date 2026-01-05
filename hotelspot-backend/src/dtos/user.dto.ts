import z from "zod";
import { UserSchema } from "../types/user.types";

export const CreateUserDTO = UserSchema.pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
})
  .extend({ confirmPassword: z.string().min(6) })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = UserSchema.pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
}).partial();

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const DeleteUserDTO = z.object({
  id: z.string().uuid(),
});

export type DeleteUserDTO = z.infer<typeof DeleteUserDTO>;
