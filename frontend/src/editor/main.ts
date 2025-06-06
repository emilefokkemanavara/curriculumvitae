import '../shared.css'
import './index.css'
import { createJsonEditor } from './json-editor';
import { validate } from './validation';
import './IssueList'
import { IssueList } from './IssueList'
import { CvSchema } from '../cv-schema';
import { createCvRepository as createIdbCvRepository } from '../storage/idb/create-cv-repository';
import { createCvId } from '../storage/create-cv-id';
import { StorableCv } from '../storage/cv-repository';

function getCvId(): string | null {
    const url = new URL(location.href);
    return url.searchParams.get('id');
}

function setCvId(id: string){
    const url = new URL(location.href);
    url.searchParams.set('id', id);
    history.replaceState({}, '', url);
}

async function main(): Promise<void> {
    const id = getCvId();
    let existingCv: StorableCv | undefined;
    const repository = createIdbCvRepository();
    if(id !== null){
        existingCv = await repository.getCv(id);
        if(!existingCv){
            console.log('could not find cv!');
            return;
        }
    }
    const jsonEditor = await createJsonEditor();
    if(existingCv){
        const parsed = CvSchema.parse(existingCv);
        const stringified = JSON.stringify(parsed, null, 2);
        jsonEditor.setValue(stringified);
    }
    const saveButton = document.getElementById('opslaan') as HTMLButtonElement;
    const issueList = document.getElementById('issue-list') as IssueList;
    saveButton.addEventListener('click', async () => {
        const result = validate(jsonEditor, CvSchema);
        if(result.success){
            issueList.issues = [];
            const newId = id || createCvId();
            const idIsNew = id === null;
            await repository.storeCv({...result.value, id: newId });
            if(idIsNew){
                setCvId(newId);
            }
        }else{
            issueList.issues = result.issues;
        }
    })
}

main();