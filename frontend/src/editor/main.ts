import '../shared.css'
import './index.css'
import { createJsonEditor } from './json-editor';
import { validate } from './validation';
import './IssueList'
import { IssueList } from './IssueList'
import { CvSchema } from '../cv-schema';
import { createCvRepository as createIdbCvRepository } from '../storage/idb/create-cv-repository';
import { createCvId } from '../storage/create-cv-id';

async function main(): Promise<void> {
    const repository = createIdbCvRepository();
    const jsonEditor = await createJsonEditor();
    const saveButton = document.getElementById('opslaan') as HTMLButtonElement;
    const issueList = document.getElementById('issue-list') as IssueList;
    saveButton.addEventListener('click', () => {
        const result = validate(jsonEditor, CvSchema);
        if(result.success){
            issueList.issues = [];
            repository.storeCv({...result.value, id: createCvId()});
        }else{
            issueList.issues = result.issues;
        }
    })
}

main();