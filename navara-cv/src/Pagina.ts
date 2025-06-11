import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageHeight } from './styles';

@customElement('cv-pagina')
export class Pagina extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: ${pageHeight};
        }
    `

    render(){
        return html`<div style="height: 100%;"><slot></slot></div>`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-pagina": Pagina;
  }
}