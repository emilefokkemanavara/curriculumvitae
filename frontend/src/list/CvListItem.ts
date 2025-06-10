import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonStyles } from '../shared-styles';
import { fullEditorUrl } from '../constants';
import { CvSummary } from '../services/cv-service';

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
        form {
            display: inline;
        }
    `]

    @property({type: Object})
    summary: CvSummary | undefined

    private dispatchDeleteRequested(){
        const event = new CustomEvent('deleterequested');
        this.dispatchEvent(event);
    }

    private dispatchCopyRequested(){
        const event = new CustomEvent('copyrequested');
        this.dispatchEvent(event);
    }

    render(){
        if(!this.summary){
            return undefined;
        }
        return html`
            <div class="row">
                <div class="left">
                    ${this.summary.name}
                </div>
                <div>
                    <button @click=${this.dispatchCopyRequested.bind(this)}>Kopi&euml;ren</button>
                    <form action="${fullEditorUrl}" method="get">
                        <input type="hidden" name="id" value="${this.summary.id}" />
                        <button type="submit">Aanpassen</button>
                    </form>
                    <button @click=${this.dispatchDeleteRequested.bind(this)}>Verwijderen</button>
                </div>
            </div>
        `
    }
}