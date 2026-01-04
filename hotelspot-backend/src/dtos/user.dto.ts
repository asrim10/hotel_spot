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

export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginUserDTOType = z.infer<typeof LoginUserDTO>;
