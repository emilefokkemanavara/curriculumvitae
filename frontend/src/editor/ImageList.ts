import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import {repeat} from 'lit/directives/repeat.js';
import './ImageListItem'

@customElement('image-list')
export class ImageList extends LitElement {
    static styles = css`
        .container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    `

    @property({type: Array})
    imageIds: string[] = []

    @property()
    selectedId: string | undefined

    render(){
        return html`<div class="container">
             ${repeat(this.imageIds, id => id, (id) => html`<image-list-item .imageId=${id} .selected=${id === this.selectedId}></image-list-item>`)}
        </div>`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "image-list": ImageList;
  }
}