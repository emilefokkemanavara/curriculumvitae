import '../shared.css'
import './index.css'
import './CvList'
import type { CvList } from './CvList'
import './CvListItem'
import '../AppLayout'
import { createCvRepository } from '../storage/idb/create-cv-repository'
import { createCvService } from '../services/cv-service'

function main(): void {
    const listEl = document.getElementById('cv-list')! as CvList;
    const repository = createCvRepository();
    listEl.dependencies = {
        cvService: createCvService(repository)
    }
}

main();