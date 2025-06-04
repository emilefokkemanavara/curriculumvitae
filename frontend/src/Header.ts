import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import logoUrl from './logo.svg'

@customElement('cv-header')
export class Header extends LitElement {
    static styles = css`
    :host {
        background-color: #000b3b;
        height: var(--header-height);
        width: 100vw;
        display: block;
        top: 0;
        position: fixed;
    }
    .container {
        height: 100%;
    }
    .logo {
        display: block;
        width: 25.76vw;
        height: 3.66vw;
        background-image: url("${unsafeCSS(logoUrl)}");
        background-position-x: center;
        background-position-y: center;
        background-size: 120%;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        left: 4.76vw;
    }
    `

    render(){
        return html`<div class="container">
        <div class="logo"></div>
        </div>`
    }
}