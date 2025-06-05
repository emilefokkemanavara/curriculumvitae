import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cv-pagina')
export class Page extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: var(--page-height);
        }
    `

    render(){
        return html`<div style="height: 100%;"><slot></slot></div>`
    }
}