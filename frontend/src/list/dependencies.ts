import { CvService } from "../services/cv-service";

export interface Dependencies {
    cvService: CvService
    getCvUrl(id: string): string
}