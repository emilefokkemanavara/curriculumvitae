import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { lightGrey } from './styles';

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
            background-color: ${lightGrey};
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

declare global {
  interface HTMLElementTagNameMap {
    "cv-samenvatting": Samenvatting;
  }
}