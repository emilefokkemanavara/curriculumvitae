import { JsonEditor } from "./json-editor"
import { PageUrl } from "../services/page-url"
import { CvService } from "../services/cv-service"

export interface Dependencies {
    pageUrl: PageUrl
    cvService: CvService
    jsonEditorFactory: (schemaUrl: string) => Promise<JsonEditor>
}