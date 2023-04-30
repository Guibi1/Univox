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
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                path: ["confirmPassword"],
                message: "Les mots de passe correspondent pas",
                code: "custom",
            });
        }
    });

export const resetPasswordSchema = z.object({ email, omnivoxPassword, password });
