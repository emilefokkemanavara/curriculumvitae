import { getCvType } from '../services/cv-type';
import { createImageService } from '../services/image-service';
import { createPageUrl } from '../services/page-url';
import { createValidationService } from '../services/validation-service';
import '../shared.css'
import { createCvDb } from '../storage/idb/create-cv-db';
import { createCvRepository } from '../storage/idb/create-cv-repository';
import { createImageRepository } from '../storage/idb/create-image-repository';
import './CvView'
import type { CvView } from './CvView'
import 'navara-cv'

function main(): void {
    const cvViewEl = document.getElementById('cv-view')! as CvView;
    const db = createCvDb();
    const repository = createCvRepository(db);
    const imageRepository = createImageRepository(db);
    const imageService = createImageService(createImageRepository(db));
    cvViewEl.dependencies = {
        pageUrl: createPageUrl(),
        cvRepository: repository,
        getCvType: () => getCvType(),
        validation: createValidationService(imageRepository),
        cvDependencies: {
            imageService: {
                async getImageUrl(image) {
                    const imageRecord = await imageService.getImage(image.id);
                    if(!imageRecord){
                        return 'some:url';
                    }
                    return URL.createObjectURL(imageRecord.content);
                },
            }
        }
    }
}

main();