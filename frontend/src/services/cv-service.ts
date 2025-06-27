import { CvRecord } from "../cv-record";
import { createCvId } from "../storage/create-id";
import { CvRepository } from "../storage/cv-repository";

export type CvSummary = {
    id: string
    name: string
}
export interface CvService {
    storeCv(cv: CvRecord, id: string | null): Promise<string>
    getCv(id: string): Promise<CvRecord | undefined>
    copyCv(id: string): Promise<void>
    deleteCv(id: string): Promise<void>
    getAllCvs(): Promise<CvSummary[]>
}

export function createCvService(repository: CvRepository): CvService {
    return {
        storeCv,
        getCv,
        deleteCv(id) {
            return repository.deleteCv(id);
        },
        async copyCv(id){
            const original = await getCv(id);
            if(!original){
                return;
            }
            const name = original.name;
            let copyId = 1;
            let newName = createNewName();
            while(await repository.hasCvByName(newName)){
                copyId++;
                newName = createNewName();
            }
            const newCv: CvRecord = {name: newName, cv: original.cv};
            await storeCv(newCv, null);
            function createNewName(){
                return `${name} (kopie${copyId === 1 ? '' : ` ${copyId}`})`
            }
        },
        async getAllCvs() {
            try{
                const result: CvSummary[] = [];
                for await(const { id, name } of repository.getAllCvs()){
                    result.push({id, name})
                }
                return result;
            }catch(e){
                console.error(e)
                throw e;
            }

        },
    }
    async function storeCv(cv: CvRecord, id: string | null): Promise<string> {
        const newId = id || createCvId();
        await repository.storeCv({...cv, id: newId});
        return newId;
    }
    async function getCv(id: string): Promise<CvRecord | undefined> {
        const stored = await repository.getCv(id);
        if(!stored){
            return undefined;
        }
        const {id: _, ...rest} = stored;
        return rest;
    }
}