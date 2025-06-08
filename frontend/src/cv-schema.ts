import z from 'zod'

export const CvSchema = z.object({
    voornaam: z.string().min(1),
    achternaam: z.string().min(1)
})

export type Cv = z.infer<typeof CvSchema>;