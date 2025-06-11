import '../shared.css'
import './index.css'
import './Editor';
import '../AppLayout';
import type { Editor } from './Editor'
import { createJsonEditor } from './json-editor';
import { createPageUrl } from '../services/page-url';
import { createCvRepository } from '../storage/idb/create-cv-repository';
import { createCvService } from '../services/cv-service';
import { getCvType } from '../services/cv-type';
import { validate } from '../services/validation';

async function main(): Promise<void> {
    const jsonEditorEl = document.getElementById('json-editor')!;
    const editorEl = document.getElementById('cv-editor')! as Editor;
    const repository = createCvRepository();
    editorEl.dependencies = {
        pageUrl: createPageUrl(),
        cvService: createCvService(repository),
        getCvType: () => getCvType(),
        validate: validate,
        jsonEditorFactory: (schemaUrl: string) => createJsonEditor(jsonEditorEl, schemaUrl)
    };
}

main();