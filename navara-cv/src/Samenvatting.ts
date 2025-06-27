import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CvElement } from '@curriculumvitae/elements';
import { lightGrey } from './styles';
import { Cv } from './schema';

@customElement('cv-samenvatting')
export class Samenvatting extends CvElement {
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

    @property({type: Object})
    cv: Cv | undefined

    render(){
        return html`
            <div class="container">
                <div class="left">
                    <img src=${this.imageUrl(this.cv?.profielfoto)} />
                </div>
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