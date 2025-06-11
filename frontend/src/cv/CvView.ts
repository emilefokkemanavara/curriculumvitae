import { provide } from '@lit/context';
import {Task} from '@lit/task';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dependenciesContext } from './dependencies-context';
import { Dependencies } from './dependencies';
import { CvRecord } from '../cv-record';
import { ValidationIssue } from '../services/validation-result';
import '../IssueList'
import { CvType } from '../services/cv-type';

@customElement('cv-view')
export class CvView extends LitElement {

    @provide({context: dependenciesContext})
    @property({type: Object})
    public dependencies: Dependencies | undefined;

    private cv: CvRecord | null | undefined;
    private cvType: CvType | undefined;
    private validationIssues: ValidationIssue[] = []

    private task = new Task(this, {
        task: async ([deps]) => {
            if(!deps){
                return;
            }
            const cvId = deps.pageUrl.getCvId();
            if(cvId === null){
                this.cv = null;
                return;
            }
            const cvRecord = await deps.cvService.getCv(cvId);
            if(!cvRecord){
                this.cv = null;
                return;
            }
            const cvType = deps.getCvType(cvRecord);
            this.cvType = cvType;
            const validationResult = deps.validate(cvRecord, cvType);
            if(validationResult.success){
                this.validationIssues = [];
                this.cv = validationResult.value;
                return;
            }
            this.cv = null;
            this.validationIssues = validationResult.issues;
        },
        args: () => [this.dependencies]
    })

    render() {
        return this.task.render({
            pending: () => html`<span>Laden...</span>`,
            complete: () => {
                if(this.cv === undefined){
                    return undefined;
                }
                if(this.validationIssues.length > 0){
                    return html`<issue-list .issues=${this.validationIssues}></issue-list>`
                }
                if(this.cv === null){
                    return html`<span>Huh, welke?</span>`
                }
                if(!this.cvType){
                    return undefined;
                }
                
                return this.cvType.render(this.cv.cv)
            },
            error: (e) => html`<span>Error: ${e}</span>`
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'cv-view': CvView
    }
}