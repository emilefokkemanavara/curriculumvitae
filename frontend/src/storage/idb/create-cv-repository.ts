import { CvRepository } from "../cv-repository";
import { CvDb } from "./create-cv-db";

export function createCvRepository(db: CvDb): CvRepository {    
    
    return {
        async storeCv(cv){
            await db.cvs.put(cv);
        },
        deleteCv(id){
            return db.cvs.delete(id);
        },
        getCv(id) {
            return db.cvs.get(id);
        },
        async hasCvByName(name) {
            return await db.cvs.indexes.name.count(name) > 0;
        },
        getAllCvs() {
            return db.cvs.indexes.name.read();
        },
    }
}