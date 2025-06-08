import { LitElement, html, css } from 'lit';
import {consume} from '@lit/context';
import { customElement, state, property } from 'lit/decorators.js';
import './IssueList'
import { CvRecord, StorableCv } from '../storage/cv-repository';
import { JsonEditor } from './json-editor';
import { jsonEditorContext } from './json-editor-context';
import { ValidationIssue } from './validation-result';
import { validate } from './validation';
import { CvSchema } from '../cv-schema';

@customElement('cv-editor-form')
export class EditorForm extends LitElement {
    static styles = css`
        button {
            font-family: "Be Vietnam Pro";
            color: var(--lightblue);
            background-color: var(--lightgrey);
            border-color: var(--lightblue);
            border-radius: 3px;
            font-size: 1em;
        }

        button:disabled{
            opacity: .5;
        }

        .name-input {
            border-width: 0;
            font-size: 1.5em;
        }

        .name-input:invalid {
            background-color: var(--lightgrey);
        }

        button:active {
            border-color: var(--lightblue);
        }

        .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .container > .body {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
        }

        .container > .header {
            padding: 10px;
            display: flex;
            flex-direction: row;
        }

        .container > .header > .left {
            flex-grow: 1;
        }

        .editor-panel {
            width: 500px;
        }

        .container > .body > .right-panel {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .container > .body > .right-panel > .top {
            flex-grow: 1;
        }
    `
    private hasInitializedJsonEditor = false;

    @property({type: Object})
    existingCv: StorableCv | undefined

    @property({type: Boolean})
    hasUnsavedChanges = false;

    @consume({context: jsonEditorContext, subscribe: true})
    jsonEditor: JsonEditor | undefined;

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

    protected updated(): void {
        if(!this.jsonEditor || this.hasInitializedJsonEditor){
            return;
        }
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
            <div class="container">
                 <div class="header">
                    <div class="left">
                        <input type="text" class="name-input" placeholder="Mijn CV" required .value="${this.name}" @input=${this.onNameInput.bind(this)} />
                    </div>
                    <div class="right">
                        <button @click="${this.validateAndSave}" .disabled=${!this.hasUnsavedChanges}>Opslaan</button>
                    </div>
                </div>
                <div class="body">
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
            </div>
        `
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-editor-form": EditorForm;
  }
}