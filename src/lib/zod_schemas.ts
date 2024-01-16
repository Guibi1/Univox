import dayjs from "dayjs";
import { z } from "zod";

/**
 * Validates a user's da
 */
export const daSchema = z.string().regex(/\d{7}/, "Numéro d'étudiant invalide");

/**
 * Validates a user's email
 */
export const emailSchema = z
    .string()
    .email("Courriel invalide")
    .endsWith(".ca", "Assurez-vous d'utiliser votre courriel étudiant");

/**
 * Validates a user's password
 */
export const passwordSchema = z
    .string()
    .min(8, "Mot de passe trop court")
    .max(120, "120 charactères maximum")
    .regex(/\d/, "Le mot de passe doit contenir un chiffre");

/**
 * Validates a user id
 */
export const userIdSchema = z.string().length(15);

/**
 * Validates a group id
 */
export const groupIdSchema = z.string().length(16);

/**
 * Validates a book id
 */
export const bookIdSchema = z.string().length(20);

/**
 * Validates a serial id (notifications, friends, etc)
 */
export const serialIdSchema = z.number().min(0);

/**
 * Validates a period
 */
export const periodSchema = z.object({
    id: z.number(),
    name: z.string().min(3),
    timeStart: z
        .string()
        .datetime()
        .transform((d) => dayjs(d)),
    timeEnd: z
        .string()
        .datetime()
        .transform((d) => dayjs(d)),
});

/**
 * Validates the required fields to login into Omnivox
 */
export const omnivoxLoginSchema = z.object({
    da: daSchema,
    email: emailSchema,
    omnivoxPassword: z.string().min(1, "Entrez votre mot de passe Omnivox"),
    mfaId: z.string().default(""),
    code: z.string().regex(/\d{6}/).optional(),
    session: z.string(),
});

/**
 * Validates an image (size, type)
 */
export const imageSchema = z
    .instanceof(File)
    .refine((file: File) => file?.size !== 0, "Il faut un fichier")
    .refine((file) => file.size < 5000000, "Le fichier doit être plus petit que 5MB")
    .refine((file) => {
        if (!file?.name) return false;
        const fileType = file.name.split(".").pop()?.toLowerCase();
        return fileType === "png" || fileType === "jpg" || fileType === "jpeg";
    }, "Seulement les PNG et les JPG sont acceptés");
