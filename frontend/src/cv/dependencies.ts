import { Dependencies as CvDependencies } from "@curriculumvitae/elements"
import { CvRecord } from "../cv-record"
import { CvService } from "../services/cv-service"
import { PageUrl } from "../services/page-url"
import { CvType } from "../services/cv-type"
import { ValidationService } from "../services/validation-service"
import { CvRepository } from "../storage/cv-repository"

export interface Dependencies {
    pageUrl: PageUrl
    cvRepository: CvRepository
    getCvType: (record: CvRecord) => CvType
    validation: ValidationService
    cvDependencies: CvDependencies
}