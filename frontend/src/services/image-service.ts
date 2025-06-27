import { createImageId } from "../storage/create-id"
import { ImageRepository, StorableImage } from "../storage/image-repository"

export interface ImageService {
    saveImage(image: File): Promise<StorableImage>
    deleteImage(id: string): Promise<void>
    getImage(id: string): Promise<StorableImage>
    getImageIds(): Promise<string[]>
}

export function createImageService(repository: ImageRepository): ImageService {
    return {
        async saveImage(image) {
            const id = createImageId();
            const storableImage: StorableImage = {
                id,
                content: image
            }
            await repository.storeImage(storableImage);
            return storableImage;
        },
        async getImageIds() {
            const result: string[] = [];
            for await(const id of repository.getAllIds()){
                result.push(id)
            }
            return result;
        },
        getImage(id) {
            return repository.getImage(id);
        },
        deleteImage(id) {
            return repository.deleteImage(id);
        },
    }
}