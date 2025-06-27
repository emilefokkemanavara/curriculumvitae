import { CvRecord } from "../cv-record";
import { CvType } from "./cv-type";
import { ImageService } from "./image-service";
import { validateZod } from "./validate-zod";
import { ValidationResult } from "./validation-result";
import { Image } from 'curriculumvitae-schemas'

const imageType: Image['type'] = 'curriculum://vitae/schemas/types/image'
export interface ValidationService {
    validate(value: CvRecord, cvType: CvType): Promise<ValidationResult<CvRecord>>
}

function *getImages(value: unknown): Iterable<Image> {
    if(!value || typeof value !== 'object'){
        return;
    }
    if('type' in value && value.type === imageType){
        if(!('id' in value) || typeof value.id !== 'string'){
            return;
        }
        yield value as Image;
        return;
    }
    for(const [_, propValue] of Object.entries(value)){
        yield* getImages(propValue)
    }
}

export function createValidationService(imageService: ImageService): ValidationService {
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
                const imageRecord = await imageService.getImage(image.id);
                if(!imageRecord){
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