import { CvService } from "../services/cv-service";
import { CvDownloadService } from "../services/download-service";

export interface Dependencies {
    cvService: CvService
    downloadService: CvDownloadService
    getCvUrl(id: string): string
}