import { JsonEditor } from "./json-editor"
import { PageUrl } from "../services/page-url"
import { CvService } from "../services/cv-service"
import { CvType } from "../services/cv-type"
import { CvRecord } from "../cv-record"
import { ValidationService } from "../services/validation-service"
import { ImageService } from "../services/image-service"

export interface Dependencies {
    pageUrl: PageUrl
    cvService: CvService
    imageService: ImageService
    getCvType: (record: CvRecord | null) => CvType
    jsonEditorFactory: (schemaUrl: string) => Promise<JsonEditor>
    validation: ValidationService
}