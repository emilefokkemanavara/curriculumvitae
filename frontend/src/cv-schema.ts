import z from 'zod'

export const CvSchema = z.object({
    voornaam: z.string(),
    achternaam: z.string()
})