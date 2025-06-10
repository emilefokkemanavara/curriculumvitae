import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cv-app-layout')
export class AppLayout extends LitElement {
    static styles = css`
        .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .container > .body {
            flex-grow: 1;
        }

        .header {
            display: flex;
            flex-direction: row;
        }

        .header > .left {
            flex-grow: 1;
        }
    `
    render(){
        return html`
            <div class="container">
                <div class="header">
                    <div class="left">
                        <slot name="header-left"></slot>
                    </div>
                    <div>
                        <slot name="header-right"></slot>
                    </div>
                </div>
                <div class="body">
                    <slot name="body"></slot>
                </div>
            </div>
        `
    }
}