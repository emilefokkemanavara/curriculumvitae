import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {classMap} from 'lit/directives/class-map.js';
import { Dependencies } from "./dependencies";
import { dependenciesContext } from "./dependencies-context";
import { consume } from "@lit/context";
import { Task } from "@lit/task";
import './Thumbnail'
import { StorableImage } from "../storage/image-repository";

const thumbnailSize = 50;

@customElement('image-list-item')
export class ImageListItem extends LitElement {
    static styles = css`
        .image-container {
            width: ${thumbnailSize}px;
            height: ${thumbnailSize}px;
            border: 1px solid transparent;
            margin: 0 -1px -1px 0;
        }
        .image-container.selected {
            border-color: var(--darkblue);
        }
    `

    @consume({context: dependenciesContext, subscribe: true})
    dependencies: Dependencies | undefined;

    @property()
    imageId: string | undefined

    @property({type: Boolean})
    selected: boolean = false;

    @state()
    private image: StorableImage | undefined

    private task = new Task(this, {
        task: async ([deps, imageId]) => {
            if(!deps || !imageId){
                return;
            }
            this.image = await deps.imageService.getImage(imageId);
        },
        args: () => [this.dependencies, this.imageId]
    })

    private dispatchSelected(): void {
        if(!this.image){
            return;
        }
        const event = new CustomEvent('imageselected', {detail: this.image, bubbles: true, composed: true});
        this.dispatchEvent(event)
    }

    render(){
        return html`<div class=${classMap({'image-container': true, 'selected': this.selected})} @click=${this.dispatchSelected.bind(this)}>
            ${this.image
                    ? html`
                        <image-thumbnail
                            .image=${this.image.content}
                            .width=${thumbnailSize}
                            .height=${thumbnailSize}></image-thumbnail>
                        `
                    : undefined
                }
        </div>`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "image-list-item": ImageListItem;
  }
}