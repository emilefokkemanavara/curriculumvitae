import { css, html, LitElement, PropertyValues } from "lit";
import {styleMap} from 'lit/directives/style-map.js';
import { customElement, property, state } from "lit/decorators.js";

@customElement('image-thumbnail')
export class Thumbnail extends LitElement {

    private _image: Blob | undefined;

    @state()
    private imageUrl: string | undefined;

    width: number = 150;
    height: number = 150;

    @property({type: Object})
    set image(value: Blob | undefined){
        if(value === this.image){
            return;
        }
        this._image = value;
        if(this.imageUrl){
            console.log('revoking object url')
            URL.revokeObjectURL(this.imageUrl)
        }
        if(value){
            this.imageUrl = URL.createObjectURL(value);
        }else{
            this.imageUrl = undefined;
        }
    }
    get image(): Blob | undefined {
        return this._image;
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if(this.imageUrl){
            URL.revokeObjectURL(this.imageUrl);
        }
    }

    render(){
        if(!this.imageUrl){
            return undefined;
        }
        const style = {
            maxWidth: `${this.width}px`,
            maxHeight: `${this.height}px`
        }
        return html`<img style=${styleMap(style)} src=${this.imageUrl} />`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "image-thumbnail": Thumbnail;
  }
}