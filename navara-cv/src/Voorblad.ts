import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js'
import { darkBlue, lightBlue, sharedStyles } from './styles';
import { Cv } from './schema';

@customElement('voorblad-regel')
export class VoorbladRegel extends LitElement {
    static styles = css`
        :host {
            display: block;
            text-align: center;
            line-height: 2;
            color: ${darkBlue};
        }
        .vietnam {
            font-family: "Be Vietnam Pro";
        }

        .source {
            font-family: "Source Serif"
        }
    `;

    @property({type: Number})
    size!: number;

    @property()
    font!: 'vietnam' | 'source'

    render(){
        const classes = {vietnam: this.font === 'vietnam', source: this.font === 'source'}
        return html`<div class=${classMap(classes)} style="font-size: ${this.size}em;"><slot></slot></div>`
    }
}

@customElement('cv-voorblad')
export class Voorblad extends LitElement {
    static styles = [sharedStyles, css`
        .cv {
            text-transform: uppercase;
        }
        .italic {
            font-style: italic;
        }
        .lightblue {
            color: ${lightBlue};
        }
    `]

    @property({type: Object})
    cv: Cv | undefined

    render(){
        return html`
            <voorblad-regel font="vietnam" size="20"><br /><br /><br /></voorblad-regel>
            <voorblad-regel font="vietnam" size="20">
                <span class="cv">curriculum vitae</span>
            </voorblad-regel>
            <voorblad-regel font="source" size="30">
                ${this.cv?.volledigeNaam}
            </voorblad-regel>
            <voorblad-regel font="source" size="20">&nbsp;</voorblad-regel>
            <voorblad-regel font="vietnam" size="20">
                ${this.cv?.rol}
            </voorblad-regel>
            <voorblad-regel font="vietnam" size="14"><br /><br /><br /></voorblad-regel>
            <voorblad-regel font="vietnam" size="14">&nbsp;</voorblad-regel>
            <voorblad-regel font="source" size="16">
                ${this.cv?.voorblad.opleiding}
            </voorblad-regel>
            <voorblad-regel font="vietnam" size="16">
                <span class="italic">${this.cv?.voorblad.opleidingInstituut}</span>
            </voorblad-regel>
            <voorblad-regel font="source" size="17">&nbsp;</voorblad-regel>
            <voorblad-regel font="source" size="16">
                Specialisatie
            </voorblad-regel>
            <voorblad-regel font="vietnam" size="16">
                <span class="italic">${this.cv?.voorblad.specialisatie}</span>
            </voorblad-regel>
            <voorblad-regel font="vietnam" size="14"><br /><br /><br /><br /></voorblad-regel>
            <voorblad-regel font="source" size="20">
                <span class="lightblue">#1 in Software Delivery</span>
            </voorblad-regel>
        `
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-voorblad": Voorblad;
    "voorblad-regel": VoorbladRegel
  }
}