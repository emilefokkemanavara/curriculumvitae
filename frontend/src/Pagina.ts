import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cv-pagina')
export class Page extends LitElement {
    static styles = css`
    :host {
        color: blue;
        font-family: sans-serif;
    }
    `

    render(){
        return html`<h1>Een pagina</h1>`
    }
}