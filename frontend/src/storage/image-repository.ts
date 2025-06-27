import { ImageRecord } from "../image-record"

export type StorableImage = ImageRecord & {id: string}
export interface ImageRepository {
    storeImage(image: StorableImage): Promise<void>
    deleteImage(id: string): Promise<void>
    getImage(id: string): Promise<StorableImage>
    getAllIds(): AsyncIterable<string>
}