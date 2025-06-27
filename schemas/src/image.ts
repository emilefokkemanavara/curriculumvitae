import { z } from "zod"

export const ImageSchema = z.object({ "type": z.literal("curriculum://vitae/schemas/types/image"), "id": z.string() })
export type Image = z.infer<typeof ImageSchema>
