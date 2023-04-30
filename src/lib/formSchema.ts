import dayjs from "dayjs";
import { z } from "zod";

const email = z
    .string()
    .email("Courriel invalide")
    .endsWith(".qc.ca", "Assurez-vous d'utiliser votre courriel étudiant");

const password = z.string().min(8, "Mot de passe trop court").max(60, "60 charactères maximum");

const omnivoxPassword = z.string().min(1, "Entrez votre mot de passe");

// Schemas

export const connexionSchema = z.object({ email, password });

export const inscriptionPartialSchema = z.object({
    email,
    omnivoxPassword,
    password: z.string(),
    confirmPassword: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    firstStep: z.boolean().default(true),
});

export const inscriptionSchema = inscriptionPartialSchema
    .extend({
        password,
        confirmPassword: z.string(),
        firstStep: z.boolean().default(false),
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

export const resetPasswordSchema = z.object({ email, omnivoxPassword, password });

export const importSchema = z.object({ omnivoxPassword });

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
