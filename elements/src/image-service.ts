import { Image } from "curriculumvitae-schemas";

export interface ImageService {
    getImageUrl(image: Image): Promise<string>
}