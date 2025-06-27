import '../shared.css'
import './index.css'
import './Editor';
import type { Editor } from './Editor'
import { createJsonEditor } from './json-editor';
import { createPageUrl } from '../services/page-url';
import { createCvRepository } from '../storage/idb/create-cv-repository';
import { createCvService } from '../services/cv-service';
import { getCvType } from '../services/cv-type';
import { createCvDb } from '../storage/idb/create-cv-db';
import { createValidationService } from '../services/validation-service';
import { createImageService } from '../services/image-service';
import { createImageRepository } from '../storage/idb/create-image-repository';

async function main(): Promise<void> {
    const jsonEditorEl = document.getElementById('json-editor')!;
    const editorEl = document.getElementById('cv-editor')! as Editor;
    const db = createCvDb();
    const imageService = createImageService(createImageRepository(db));
    editorEl.dependencies = {
        pageUrl: createPageUrl(),
        cvService: createCvService(createCvRepository(db)),
        imageService,
        getCvType: () => getCvType(),
        validation: createValidationService(imageService),
        jsonEditorFactory: (schemaUrl: string) => createJsonEditor(jsonEditorEl, schemaUrl)
    };
}

main();