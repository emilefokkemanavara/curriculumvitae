import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js'

@customElement('titelblad-regel')
class TitelbladRegel extends LitElement {
    static styles = css`
        :host {
            display: block;
            text-align: center;
            line-height: 2;
            color: var(--darkblue);
        }
        .vietnam {
            font-family: "Be Vietnam Pro";
        }

        .source {
            font-family: "Source Serif"
        }
    `;

    @property()
    size!: number;

    @property()
    font!: 'vietnam' | 'source'

    render(){
        const classes = {vietnam: this.font === 'vietnam', source: this.font === 'source'}
        return html`<div class=${classMap(classes)} style="font-size: ${this.size}em;"><slot></slot></div>`
    }
}

@customElement('cv-titelblad')
export class TitelBlad extends LitElement {
    static styles = css`
        .cv {
            text-transform: uppercase;
        }
        .italic {
            font-style: italic;
        }
        .lightblue {
            color: var(--lightblue);
        }
    `

    render(){
        return html`
            <titelblad-regel font="vietnam" size="20"><br /><br /><br /></titelblad-regel>
            <titelblad-regel font="vietnam" size="20">
                <span class="cv">curriculum vitae</span>
            </titelblad-regel>
            <titelblad-regel font="source" size="30">
                Emile Fokkema
            </titelblad-regel>
            <titelblad-regel font="source" size="20">&nbsp;</titelblad-regel>
            <titelblad-regel font="vietnam" size="20">
                Software Engineer
            </titelblad-regel>
            <titelblad-regel font="vietnam" size="14"><br /><br /><br /></titelblad-regel>
            <titelblad-regel font="vietnam" size="14">&nbsp;</titelblad-regel>
            <titelblad-regel font="source" size="16">
                Wiskunde
            </titelblad-regel>
            <titelblad-regel font="vietnam" size="16">
                <span class="italic">Universiteit Utrecht</span>
            </titelblad-regel>
            <titelblad-regel font="source" size="17">&nbsp;</titelblad-regel>
            <titelblad-regel font="source" size="16">
                Specialisatie
            </titelblad-regel>
            <titelblad-regel font="vietnam" size="16">
                <span class="italic">Angular, TypeScript, C#</span>
            </titelblad-regel>
            <titelblad-regel font="vietnam" size="14"><br /><br /><br /><br /></titelblad-regel>
            <titelblad-regel font="source" size="20">
                <span class="lightblue">#1 in Software Delivery</span>
            </titelblad-regel>
        `
    }
}