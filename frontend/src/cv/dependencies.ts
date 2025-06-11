import { ZodType } from "zod"
import { CvRecord } from "../cv-record"
import { CvService } from "../services/cv-service"
import { PageUrl } from "../services/page-url"
import { ValidationResult } from "../services/validation-result"
import { CvType } from "../services/cv-type"

export interface Dependencies {
    pageUrl: PageUrl
    cvService: CvService
    getCvType: (record: CvRecord) => CvType
    validate(value: CvRecord, cvType: CvType): ValidationResult<CvRecord>
}