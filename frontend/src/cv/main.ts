import { createCvService } from '../services/cv-service';
import { getCvType } from '../services/cv-type';
import { createPageUrl } from '../services/page-url';
import { validate } from '../services/validation';
import '../shared.css'
import { createCvDb } from '../storage/idb/create-cv-db';
import { createCvRepository } from '../storage/idb/create-cv-repository';
import './CvView'
import type { CvView } from './CvView'
import 'navara-cv'

function main(): void {
    const cvViewEl = document.getElementById('cv-view')! as CvView;
    const repository = createCvRepository(createCvDb());
    cvViewEl.dependencies = {
        pageUrl: createPageUrl(),
        cvService: createCvService(repository),
        getCvType: () => getCvType(),
        validate(record, cvType){
            const cvValidationResult = validate(record.cv, cvType.schema);
            if(cvValidationResult.success){
                return {
                    success: true,
                    value: {
                        name: record.name,
                        cv: cvValidationResult.value
                    }
                }
            }
            return {
                success: false,
                issues: cvValidationResult.issues
            }
        },
    }
}

main();