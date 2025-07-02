import { CvRecord } from "../cv-record";
import { ImageRepository } from "../storage/image-repository";
import { CvType } from "./cv-type";
import { getImages } from "./get-images";
import { validateZod } from "./validate-zod";
import { ValidationResult } from "./validation-result";

export interface ValidationService {
    validate(value: CvRecord, cvType: CvType): Promise<ValidationResult<CvRecord>>
}

export function createValidationService(imageRepository: ImageRepository): ValidationService {
    return {
        async validate(value, cvType) {
            const cvValidationResult = validateZod(value.cv, cvType.schema);
            if(!cvValidationResult.success){
                return {
                    success: false,
                    issues: cvValidationResult.issues
                }
            }
            for(const image of getImages(value.cv)){
                const hasImage = await imageRepository.hasImageById(image.id);
                if(!hasImage){
                    return {
                            success: false,
                            issues: [
                                {
                                    type: 'missing_image',
                                    imageId: image.id
                                }
                            ]
                        }
                }
            }
            return {
                success: true,
                value: {
                    name: value.name,
                    cv: cvValidationResult.value
                }
            }
        },
    }
}