import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type {Cv as CvType} from './schema'
import './Header';
import './Pagina'
import './Voorblad'
import './Samenvatting'
import { headerHeight } from './styles';

@customElement('navara-cv')
export class Cv extends LitElement {
    static styles = css`
      cv-pagina:first-of-type{
        padding-top: ${headerHeight};
      }
    `

    @property({type: Object})
    cv: CvType | undefined;

    render(){
        return html`
          <cv-header></cv-header>
          <cv-pagina>
            <cv-voorblad .cv=${this.cv}></cv-voorblad>
          </cv-pagina>
          <cv-pagina>
            <cv-samenvatting .cv=${this.cv}></cv-samenvatting>
          </cv-pagina>
        `
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "navara-cv": Cv;
  }
}