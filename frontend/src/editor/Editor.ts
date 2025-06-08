import { LitElement, html } from 'lit';
import {Task} from '@lit/task';
import { provide } from '@lit/context';
import { customElement, property, state } from 'lit/decorators.js';
import { createPageUrl, PageUrl } from './page-url';
import { CvRecord, CvRepository, StorableCv } from '../storage/cv-repository';
import { createCvRepository as createIdbCvRepository } from '../storage/idb/create-cv-repository';
import './EditorForm'
import { JsonEditor } from './json-editor';
import { jsonEditorContext } from './json-editor-context';
import { createCvId } from '../storage/create-cv-id';

@customElement('cv-editor')
export class Editor extends LitElement {
    private pageUrl: PageUrl = createPageUrl();
    private repository: CvRepository = createIdbCvRepository();

    @state()
    private hasUnsavedChanges = true

    private task = new Task(this, {
        task: async ([cvId]) => {
            if(cvId === null){
                return;
            }
            const existingCv = await this.repository.getCv(cvId);
            if(existingCv){
                this.hasUnsavedChanges = false;
            }
            this.existingCv = existingCv;
        },
        args: () => [this.cvId]
    })

    cvId: string | null = null;
    newCvId: string | null = null;

    @state()
    private existingCv: StorableCv | undefined;

    @provide({context: jsonEditorContext})
    @property({type: Object})
    jsonEditor: JsonEditor | undefined;

    private async onSaveRequested(ev: CustomEvent<CvRecord>): Promise<void> {
        const cv = ev.detail;
        const cvIsNew = this.newCvId === null;
        const newId = this.cvId || this.newCvId || (this.newCvId = createCvId());
        await this.repository.storeCv({...cv, id: newId });
        if(cvIsNew){
            this.pageUrl.setCvId(newId);
            this.newCvId = newId
        }
        this.hasUnsavedChanges = false;
    }

    private onFormChanged(){
        console.log('form changed!')
        this.hasUnsavedChanges = true;
    }

    protected firstUpdated(): void {
        this.cvId = this.pageUrl.getCvId();
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