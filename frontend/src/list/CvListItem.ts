import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonStyles } from '../shared-styles';
import { fullEditorUrl } from '../constants';
import { CvSummary } from '../services/cv-service';
import { Dependencies } from './dependencies';
import { consume } from '@lit/context';
import { dependenciesContext } from './dependencies-context';

@customElement('cv-list-item')
export class CvListItem extends LitElement {
    static styles = [buttonStyles, css`
        .row {
            padding: 1em;
            display: flex;
            flex-direction: row;
        }
        .row > .left {
            flex-grow: 1;
        }
        a {
            color: var(--darkblue);
            text-decoration-color: transparent
        }
        a:hover{
            text-decoration-color: var(--darkblue)
        }
        form {
            display: inline;
        }
    `]

    @property({type: Object})
    summary: CvSummary | undefined

    @consume({context: dependenciesContext, subscribe: true})
    dependencies: Dependencies | undefined

    private dispatchDeleteRequested(){
        const event = new CustomEvent('deleterequested');
        this.dispatchEvent(event);
    }

    private dispatchCopyRequested(){
        const event = new CustomEvent('copyrequested');
        this.dispatchEvent(event);
    }

    private onDownloadClick(): void {
        if(!this.dependencies || !this.summary){
            return;
        }
        this.dependencies.downloadService.downloadCv(this.summary.id);
    }

    render(){
        if(!this.summary || !this.dependencies){
            return undefined;
        }
        return html`
            <div class="row">
                <div class="left">
                    <a href="${this.dependencies.getCvUrl(this.summary.id)}">${this.summary.name}</a>
                    
                </div>
                <div>
                    <button @click=${this.dispatchCopyRequested.bind(this)}>\u{1f501}</button>
                    <form action="${fullEditorUrl}" method="get">
                        <input type="hidden" name="id" value="${this.summary.id}" />
                        <button type="submit">\u{1f4dd}</button>
                    </form>
                    <button @click=${this.dispatchDeleteRequested.bind(this)}>\u{1f5d1}</button>
                    <button @click=${this.onDownloadClick.bind(this)}>\u{1f4e5}</button></div>
            </div>
        `
    }
}