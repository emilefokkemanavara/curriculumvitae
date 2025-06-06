import { Cv } from "../cv-schema";

export type StorableCv = Cv & {id: string}
export interface CvRepository {
    storeCv(cv: StorableCv): Promise<void>
    getCv(id: string): Promise<StorableCv | undefined>
}