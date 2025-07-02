import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import {Task} from '@lit/task';
import { Dependencies } from "./dependencies";
import './Thumbnail'
import './ImageList'
import { consume } from "@lit/context";
import { dependenciesContext } from "./dependencies-context";
import { StorableImage } from "../storage/image-repository";
import { buttonStyles } from "../shared-styles";

@customElement('cv-image-selector')
export class ImageSelector extends LitElement {
    static styles = [buttonStyles, css`
        input[type="file"]{
            display: none;
        }
        button {
            background-color: transparent;
            border: none;
        }
        summary {
            font-size: 1.5em;
        }

        .container {
            display: flex;
            flex-direction: row;
            max-height: 120px;
        }
        .controls {
            display: flex;
            flex-direction: column;
            width: 2em;
            padding: 3px;
        }
        .image-details{
            display: flex;
            flex-direction: column;
            padding: 3px;
        }
        .image-list {
            max-width: 158px;
            overflow-y: scroll;
            padding: 3px;
        }
        `]
    
    @consume({context: dependenciesContext, subscribe: true})
    dependencies: Dependencies | undefined;

    @state()
    private imageIds: string[] = [];

    @state()
    private selectedImage: StorableImage | undefined

    private task = new Task(this, {
        task: async ([deps]) => {
            if(!deps){
                return;
            }
            this.imageIds = await deps.imageService.getImageIds();
        },
        args: () => [this.dependencies]
    })

    private async onFileInput(ev: InputEvent): Promise<void> {
        if(!this.dependencies){
            return;
        }
        const input = ev.target as HTMLInputElement;
        const file = input.files ? input.files[0] : undefined;
        if(!file){
            return;
        }
        const storedImage = await this.dependencies.imageService.saveImage(file);
        this.selectedImage = storedImage;
        this.task.run();
    }

    private async onDeleteClick(): Promise<void> {
        if(!this.dependencies || !this.selectedImage){
            return;
        }
        await this.dependencies.imageService.deleteImage(this.selectedImage.id);
        this.selectedImage = undefined;
        this.task.run();
    }

    private onImageSelected(ev: CustomEvent<StorableImage>): void {
        this.selectedImage = ev.detail;
    }

    render() {
        return html`
            <details>
                <summary>\u{1f5bc}</summary>
                <div class="container">
                    <div class="image-list">
                        <image-list .imageIds=${this.imageIds} @imageselected=${this.onImageSelected.bind(this)} .selectedId=${this.selectedImage?.id}></image-list>
                    </div>
                    <div class="controls">
                        <label for="file-input" class="button-like">\u{1f4e4}</label>
                        <input
                            @input=${this.onFileInput.bind(this)}
                            type="file"
                            accept="image/*"
                            id="file-input" />
                        <button 
                            @click=${this.onDeleteClick.bind(this)}
                            .disabled=${!this.selectedImage} >\u{1f5d1}</button>
                    </div>
                    <div class="image-details">
                        <code>${this.selectedImage?.id}</code>
                        <image-thumbnail .image=${this.selectedImage?.content} .width=${100} .height=${100}></image-thumbnail>
                    </div>
                </div>
                
            </details>
            
        `
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-image-selector": ImageSelector;
  }
}