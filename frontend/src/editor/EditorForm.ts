import { LitElement, html, css } from 'lit';
import {consume} from '@lit/context';
import { customElement, state, property } from 'lit/decorators.js';
import '../IssueList'
import './ImageSelector'
import { JsonEditor } from './json-editor';
import { ValidationIssue } from '../services/validation-result';
import { buttonStyles } from '../shared-styles';
import { Dependencies } from './dependencies';
import { dependenciesContext } from './dependencies-context';
import { CvRecord } from '../cv-record';
import { CvType } from '../services/cv-type';

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

        .body > .right-panel > .bottom {
            padding: 1em;
        }
    `]
    private hasInitialized = false;

    @property({type: Object})
    existingCv: CvRecord | null | undefined

    private cvType: CvType | undefined;

    @state()
    private isValidating = false;

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

    private async validateAndSave(): Promise<void> {
        if(!this.jsonEditor || !this.dependencies || !this.cvType){
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
        this.isValidating = true;
        const validatedCv = await this.dependencies.validation.validate({name: this.name, cv}, this.cvType);
        this.isValidating = false;
        if(!validatedCv.success){
            this.validationIssues = validatedCv.issues;
            return;
        }
        this.validationIssues = [];
        const cvToStore: CvRecord = {
            name: this.name,
            cv: validatedCv.value.cv
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
        if(!this.dependencies || this.existingCv === undefined || this.hasInitialized){
            return;
        }
        const cvType = this.dependencies.getCvType(this.existingCv);
        this.cvType = cvType;
        this.jsonEditor = await this.dependencies.jsonEditorFactory(cvType.jsonSchemaUrl);
        if(this.existingCv){
            const {cv} = this.existingCv;
            this.jsonEditor.setValue(cv);
        }
        this.jsonEditor.addEventListener('changed', (e) => {
            this.dispatchChanged();
        })
        this.hasInitialized = true;
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
                    <button @click="${this.validateAndSave}" .disabled=${!this.hasUnsavedChanges || this.isValidating}>Opslaan</button>
                </div>
                <div class="body" slot="body">
                    <div class="editor-panel">
                        <slot name="json-editor"></slot>
                    </div>
                    <div class="right-panel">
                        <div class="top">
                            <issue-list .issues="${this.validationIssues}"></issue-list>
                        </div>
                        <div class="bottom">
                            <cv-image-selector></cv-image-selector>
                        </div>
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