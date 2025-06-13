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

function main(): void {
    const listEl = document.getElementById('cv-list')! as CvList;
    const repository = createCvRepository(createCvDb());
    listEl.dependencies = {
        cvService: createCvService(repository),
        getCvUrl(id) {
            const url = new URL(fullCvUrl);
            url.searchParams.set('id', id);
            return url.toString()
        },
    }
}

main();