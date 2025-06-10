import { LitElement, html, css } from 'lit';
import {consume} from '@lit/context';
import { customElement, state, property } from 'lit/decorators.js';
import './IssueList'
import { JsonEditor } from './json-editor';
import { ValidationIssue } from './validation-result';
import { validate } from './validation';
import { CvRecord, CvSchema } from '../cv-schema';
import { buttonStyles } from '../shared-styles';
import { Dependencies } from './dependencies';
import { dependenciesContext } from './dependencies-context';
import { fullCvSchemaUrl } from '../constants';

@customElement('cv-editor-form')
export class EditorForm extends LitElement {
    static styles = [buttonStyles, css`
        form {
            display: inline;
        }
        
        .name-input {
            border-width: 0;
            font-size: 1.5em;
            color: var(--darkblue);
        }

        .name-input:invalid {
            background-color: var(--lightgrey);
        }

        .body {
            height: 100%;
            display: flex;
            flex-direction: row;
        }

        .header {
            padding: 1em;
        }

        .editor-panel {
            width: 500px;
        }

        .body > .right-panel {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .body > .right-panel > .top {
            flex-grow: 1;
        }
    `]
    private hasInitializedJsonEditor = false;

    @property({type: Object})
    existingCv: CvRecord | undefined

    @property({type: Boolean})
    hasUnsavedChanges = false;

    @state()
    jsonEditor: JsonEditor | undefined;

    @consume({context: dependenciesContext, subscribe: true})
    dependencies: Dependencies | undefined;

    @state()
    validationIssues: ValidationIssue[] = [];

    name: string = ''

    private onNameInput(ev: InputEvent): void {
        const newValue = (ev.target as HTMLInputElement).value;
        this.name = newValue;
        this.dispatchChanged();
    }

    private validateAndSave(): void {
        if(!this.jsonEditor){
            return;
        }
        if(!this.name){
            this.validationIssues = [
                {
                    type: 'general',
                    message: 'Moet een naam hebben'
                }
            ];
            return;
        }
        const value = this.jsonEditor.getValue();
        if(!value || this.jsonEditor.hasErrors()){
            this.validationIssues = [
                {
                    type: 'general',
                    message: 'Geen geldige JSON'
                }
            ];
            return;
        }
        const cv = this.jsonEditor.getValue();
        const validatedCv = validate(cv, CvSchema);
        if(!validatedCv.success){
            this.validationIssues = validatedCv.issues;
            return;
        }
        this.validationIssues = [];
        const cvToStore: CvRecord = {
            name: this.name,
            cv: validatedCv.value
        }
        const event = new CustomEvent('saverequested', {detail: cvToStore });
        this.dispatchEvent(event);
    }

    private dispatchChanged(){
        const event = new CustomEvent('changed');
        this.dispatchEvent(event);
    }

    protected firstUpdated(): void {
        if(this.existingCv){
            this.name = this.existingCv.name;
        }
    }

    protected async updated(): Promise<void> {
        if(!this.dependencies || this.hasInitializedJsonEditor){
            return;
        }
        this.jsonEditor = await this.dependencies.jsonEditorFactory(fullCvSchemaUrl);
        if(this.existingCv){
            const {cv} = this.existingCv;
            this.jsonEditor.setValue(cv);
        }
        this.jsonEditor.addEventListener('changed', (e) => {
            this.dispatchChanged();
        })
        this.hasInitializedJsonEditor = true;
    }

    render(){
        return html`
            <cv-app-layout>
                <div class="header" slot="header-left">
                    <input type="text" class="name-input" placeholder="Mijn CV" required .value="${this.existingCv?.name || ''}" @input=${this.onNameInput.bind(this)} />
                </div>
                <div class="header" slot="header-right">
                    <form action=".." method="get">
                        <button type="submit">Naar overzicht</button>
                    </form>
                    <button @click="${this.validateAndSave}" .disabled=${!this.hasUnsavedChanges}>Opslaan</button>
                </div>
                <div class="body" slot="body">
                    <div class="editor-panel">
                        <slot name="json-editor"></slot>
                    </div>
                    <div class="right-panel">
                        <div class="top">
                            <issue-list .issues="${this.validationIssues}"></issue-list>
                        </div>
                        <div class="bottom">feedback</div>
                    </div>
                </div>
            </cv-app-layout>
        `
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-editor-form": EditorForm;
  }
}