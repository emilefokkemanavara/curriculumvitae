import { ImageRepository } from "../image-repository";
import { CvDb } from "./create-cv-db";

export function createImageRepository(db: CvDb): ImageRepository {
    return {
        async storeImage({id, content}) {
            const buffer = await content.arrayBuffer();
            const blob = new Blob([buffer], {type: content.type})
            await db.images.put({
                id,
                content: blob
            })
        },
        getAllIds() {
            return db.images.readKeys();
        },
        async getImage(id) {
            return await db.images.get(id)
        },
        deleteImage(id) {
            return db.images.delete(id);
        },
    }
}