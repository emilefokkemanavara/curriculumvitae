import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Dependencies as CvDependencies, dependenciesContext as cvDependenciesContext } from "@curriculumvitae/elements";
import { provide } from "@lit/context";

@customElement('cv-dependencies-provider')
export class CvDependenciesProvider extends LitElement {

    @provide({context: cvDependenciesContext})
    @property({type: Object})
    cvDependencies: CvDependencies | undefined

    render(){
        return html`<slot></slot>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'cv-dependencies-provider': CvDependenciesProvider
    }
}