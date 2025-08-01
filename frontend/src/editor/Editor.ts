import { LitElement, html } from 'lit';
import {Task} from '@lit/task';
import { provide } from '@lit/context';
import { customElement, property, state } from 'lit/decorators.js';
import './EditorForm'
import '../AppLayout'
import { Dependencies } from './dependencies';
import { dependenciesContext } from './dependencies-context';
import { CvRecord } from '../cv-record';

@customElement('cv-editor')
export class Editor extends LitElement {
    private hasInitialized = false;

    @provide({context: dependenciesContext})
    @property({type: Object})
    public dependencies: Dependencies | undefined;

    @state()
    private hasUnsavedChanges = true

    private task = new Task(this, {
        task: async ([cvId, deps]) => {
            if(cvId === null || !deps){
                this.existingCv = null;
                return;
            }
            const existingCv = await deps.cvService.getCv(cvId);
            if(existingCv){
                this.hasUnsavedChanges = false;
                this.existingCv = existingCv;
            }else{
                this.existingCv = null;
            }
        },
        args: () => [this.cvId, this.dependencies]
    })

    cvId: string | null = null;
    newCvId: string | null = null;

    @state()
    private existingCv: CvRecord | null | undefined;

    private async onSaveRequested(ev: CustomEvent<CvRecord>): Promise<void> {
        if(!this.dependencies){
            return;
        }
        const cv = ev.detail;
        const cvIsNew = !this.cvId && this.newCvId === null;
        const newCv = await this.dependencies.cvService.storeCv(cv, this.cvId || this.newCvId);
        this.newCvId = newCv.id;
        this.existingCv = newCv;
        if(cvIsNew){
            this.dependencies.pageUrl.setCvId(newCv.id);
        }
        this.hasUnsavedChanges = false;
    }

    private onFormChanged(){
        this.hasUnsavedChanges = true;
    }

    protected updated(){
        if(!this.dependencies || this.hasInitialized){
            return;
        }
        this.cvId = this.dependencies.pageUrl.getCvId();
        this.hasInitialized = true;
    }

    render(){
        return this.task.render({
            pending: () => html`<span>Laden...</span>`,
            complete: () => {
                if(this.cvId !== null && !this.existingCv){
                    return html`<span>Huh, welke?</span>`
                }
                return html`
                <cv-editor-form 
                    @saverequested="${this.onSaveRequested.bind(this)}"
                    @changed=${this.onFormChanged.bind(this)} 
                    .existingCv=${this.existingCv}
                    .hasUnsavedChanges=${this.hasUnsavedChanges} >
                    <slot slot="json-editor" name="json-editor"></slot>
                </cv-editor-form>`;
            },
            error: (e) => html`<span>Error: ${e}</span>`
        })
    }
}