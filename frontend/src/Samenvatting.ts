import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cv-samenvatting')
export class Samenvatting extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
        }
        .container {
            display: flex;
            flex-direction: row;
            height: 100%;
        }
        .left {
            background-color: var(--lightgrey);
            width: 33.3vw;
        }
        .right {
            flex-grow: 1;
        }
    `

    render(){
        return html`
            <div class="container">
                <div class="left">blah</div>
                <div class-"right">bluh</div>
            </div>
        `
    }
}