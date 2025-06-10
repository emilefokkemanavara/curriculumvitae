import { CvRecord } from "../cv-schema";

export type StorableCv = CvRecord & {id: string}
export interface CvRepository {
    storeCv(cv: StorableCv): Promise<void>
    deleteCv(id: string): Promise<void>
    getCv(id: string): Promise<StorableCv | undefined>
    hasCvByName(name: string): Promise<boolean>
    getAllCvs(): AsyncIterable<StorableCv>
}