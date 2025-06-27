import { LitElement } from "lit";
import { Image } from "curriculumvitae-schemas";
import { AsyncDirective, directive, PartInfo } from "lit/async-directive.js";
import { Dependencies } from "./dependencies";
import { consume } from "@lit/context";
import { dependenciesContext } from "./dependencies-context";

class ImageUrlDirective extends AsyncDirective {
    constructor(part: PartInfo){
        super(part);
    }
    render(dependencies: Dependencies | undefined, image: Image | undefined) {
        if(!dependencies || !image){
            return 'some:url';
        }
        dependencies.imageService.getImageUrl(image).then(url => this.setValue(url))
    }
}

export class CvElement extends LitElement {

    @consume({context: dependenciesContext, subscribe: true})
    cvDependencies: Dependencies | undefined

    private _imageUrl = directive(ImageUrlDirective);
    protected imageUrl(image: Image | undefined) {
        return this._imageUrl(this.cvDependencies, image)
    }
}