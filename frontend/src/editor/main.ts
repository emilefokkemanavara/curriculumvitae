import '../shared.css'
import './index.css'
import { createJsonEditor } from './json-editor';
import { validate } from './validation';
import './IssueList'
import { IssueList } from './IssueList'
import { CvSchema } from '../cv-schema';

async function main(): Promise<void> {
    const jsonEditor = await createJsonEditor();
    const saveButton = document.getElementById('opslaan') as HTMLButtonElement;
    const issueList = document.getElementById('issue-list') as IssueList;
    saveButton.addEventListener('click', () => {
        const issues = validate(jsonEditor, CvSchema);
        issueList.issues = issues;
    })
}

main();