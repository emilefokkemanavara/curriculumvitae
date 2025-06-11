import { JsonEditor } from "./json-editor"
import { PageUrl } from "../services/page-url"
import { CvService } from "../services/cv-service"
import { CvType } from "../services/cv-type"
import { CvRecord } from "../cv-record"
import { ZodType } from "zod"
import { ValidationResult } from "../services/validation-result"

export interface Dependencies {
    pageUrl: PageUrl
    cvService: CvService
    getCvType: (record: CvRecord | null) => CvType
    validate<T>(value: unknown, schema: ZodType<T>): ValidationResult<T>
    jsonEditorFactory: (schemaUrl: string) => Promise<JsonEditor>
}