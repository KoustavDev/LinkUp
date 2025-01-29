import { z } from "zod";

export const SignupValidation = z.object({
  name: z
    .string()
    .min(6, {
      message: "Name must be at least 6 characters.",
    })
    .max(15, {
      message: "Name must be at most 15 characters.",
    }),
  username: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(15, {
      message: "Username must be at most 15 characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(18, {
      message: "Password must be at most 18 characters.",
    }),
  email: z.string().email("Invalid email"),
});
export const SigninValidation = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(18, {
      message: "Password must be at most 18 characters.",
    }),
});

export const emailValidation = z.object({
  email: z.string().email("Invalid email"),
});
export const passwordValidation = z.object({
  passwordNew: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(18, {
      message: "Password must be at most 18 characters.",
    }),
  passwordConform: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(18, {
      message: "Password must be at most 18 characters.",
    }),
});

export const postValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z
    .string()
    .min(6, { message: "Name must be at least 6 characters." })
    .max(15, { message: "Name must be at most 15 characters." }),
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters." })
    .max(15, { message: "Username must be at most 15 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
