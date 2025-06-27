import { z } from "zod"

export const CvSchema = z.object({ "voornaam": z.string(), "volledigeNaam": z.string(), "rol": z.string(), "geboortedatum": z.string(), "voorblad": z.object({ "opleiding": z.string(), "opleidingInstituut": z.string(), "specialisatie": z.string() }), "profielfoto": z.object({ "type": z.literal("curriculum://vitae/schemas/types/image"), "id": z.string() }) })
export type Cv = z.infer<typeof CvSchema>
