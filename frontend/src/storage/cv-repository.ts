import { Cv } from "../cv-schema";

export type CvRecord = {
    name: string
    cv: Cv
}
export type StorableCv = CvRecord & {id: string}
export interface CvRepository {
    storeCv(cv: StorableCv): Promise<void>
    getCv(id: string): Promise<StorableCv | undefined>
}