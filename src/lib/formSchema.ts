import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Montreal");

const email = z
    .string()
    .email("Courriel invalide")
    .endsWith(".qc.ca", "Assurez-vous d'utiliser votre courriel étudiant");

const password = z.string().min(8, "Mot de passe trop court").max(60, "60 charactères maximum");

const omnivoxPassword = z.string().min(1, "Entrez votre mot de passe");

// Schemas

export const newPasswordSchema = z
    .object({
        password,
        confirmPassword: z.string(),
    })
    .superRefine(({ confirmPassword, password }, { addIssue }) => {
        if (confirmPassword !== password) {
            addIssue({
                path: ["confirmPassword"],
                message: "Les mots de passe correspondent pas",
                code: "custom",
            });
        }
    });

export const connectionOmnivoxSchema = z.object({
    email,
    omnivoxPassword,
    mfaId: z.string().default(""),
    code: z.string().regex(/\d{6}/).optional(),
    session: z.string(),
});

export const connexionSchema = z.object({ email, password });

export const inscriptionSchema = connectionOmnivoxSchema
    .extend({
        email,
        password: z.string(),
        confirmPassword: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),

        firstStep: z.boolean().default(true),
    })
    .superRefine(({ confirmPassword, password }, { addIssue }) => {
        if (confirmPassword !== password) {
            addIssue({
                path: ["confirmPassword"],
                message: "Les mots de passe correspondent pas",
                code: "custom",
            });
        }
    });

export const resetPasswordSchema = connectionOmnivoxSchema.extend({ password });

export const newPeriodSchema = z
    .object({
        name: z.string().min(1, "Requis"),
        date: z.string().regex(/\d\d\d\d-\d\d-\d\d/),
        startTime: z.string().regex(/\d\d:\d\d/),
        endTime: z.string().regex(/\d\d:\d\d/),
    })
    .superRefine(({ startTime, endTime }, { addIssue }) => {
        if (!dayjs(startTime, "HH:mm").isBefore(dayjs(endTime, "HH:mm"), "minutes")) {
            addIssue({
                path: ["endTime"],
                message: "La fin de l'évenement doit être après le début",
                code: "custom",
            });
        }
    });

export const newBookSchema = z.object({
    title: z.string().min(1, "Requis"),
    author: z.string().min(1, "Requis"),
    state: z.string().min(1, "Requis"),
    price: z.number().min(0, "Le prix doit être positif").max(300, "Le prix doit être sous 300 $"),
    classCode: z.string().min(1, "Requis"),
    images: z.string().optional(),
    ISBN: z
        .string()
        .min(1, "L'ISBN est requis")
        .regex(
            /(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]/,
            "Format invalide"
        )
        .refine((ISBN) => {
            /**
             * Tests the format and the check digit of an ISBN
             * @param ISBN The ISBN to verify
             * @author https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
             */

            // Remove non digits
            const chars = ISBN.replace(/[^0-9X]/g, "").split("");
            const checkDigit = chars.pop();

            let result: string | number = 0;
            let sum = 0;

            // Test the Check Digit
            if (ISBN.length === 10) {
                for (let i = 0; i < 9; i++) {
                    sum += (10 - i) * parseInt(chars[i], 10);
                }
                result = 11 - (sum % 11);
                if (result == 10) result = "X";
                else if (result == 11) result = 0;
            } else {
                let sum = 0;
                for (let i = 0; i < 12; i++) {
                    sum += ((i % 2) * 2 + 1) * parseInt(chars[i], 10);
                }
                result = 10 - (sum % 10);
                if (result == 10) result = "0";
            }

            return result == checkDigit;
        }, "L'ISBN n'exsite pas"),
});

export const imageSchema = z
    .instanceof(File)
    .refine((file: File) => file?.length !== 0, "Il faut un fichier")
    .refine((file) => file.size < 5000000, "Le fichier doit être plus petit que 5MB")
    .refine((file) => {
        if (!file?.name) return false;
        const fileType = file.name.split(".").pop()?.toLowerCase();
        return fileType === "png" || fileType === "jpg" || fileType === "jpeg";
    }, "Seulement les PNG et les JPG sont acceptés");
