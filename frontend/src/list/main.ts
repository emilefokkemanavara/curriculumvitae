import '../shared.css'
import './index.css'
import './CvList'
import type { CvList } from './CvList'
import './CvListItem'
import '../AppLayout'
import { createCvRepository } from '../storage/idb/create-cv-repository'
import { createCvService } from '../services/cv-service'
import { fullCvUrl } from '../constants'
import { createCvDb } from '../storage/idb/create-cv-db'
import { createImageRepository } from '../storage/idb/create-image-repository'
import { createCvDownloadService } from '../services/download-service'

function main(): void {
    const listEl = document.getElementById('cv-list')! as CvList;
    const cvDb = createCvDb();
    const cvRepository = createCvRepository(cvDb);
    const imageRepository = createImageRepository(cvDb);
    const cvService = createCvService(cvRepository);
    listEl.dependencies = {
        cvService,
        downloadService: createCvDownloadService(cvService, imageRepository),
        getCvUrl(id) {
            const url = new URL(fullCvUrl);
            url.searchParams.set('id', id);
            return url.toString()
        },
    }
}

main();