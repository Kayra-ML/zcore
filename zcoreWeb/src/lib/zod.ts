import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin."),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır.")
    .regex(/[A-Z]/, "Şifre en az 1 büyük harf içermelidir.")
    .regex(/[a-z]/, "Şifre en az 1 küçük harf içermelidir.")
    .regex(/[0-9]/, "Şifre en az 1 rakam içermelidir."),
});

export const LoginSchema = z.object({
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin."),
  password: z.string().min(1, "Şifre gereklidir."),
});
