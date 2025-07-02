import { CvRecord } from "../cv-record";
import { createCvId } from "../storage/create-id";
import { CvRepository, StorableCv } from "../storage/cv-repository";

export type CvSummary = {
    id: string
    name: string
}
export interface CvService {
    storeCv(cv: CvRecord, id: string | null): Promise<StorableCv>
    getCv(id: string): Promise<CvRecord | undefined>
    copyCv(id: string): Promise<void>
    deleteCv(id: string): Promise<void>
    getAllCvs(): Promise<CvSummary[]>
}

function *copyNames(initial: string): Iterable<string> {
    let copyId = 1;
    while(true){
        yield createNewName();
        copyId++;
    }
    function createNewName(){
        return `${initial} (kopie${copyId === 1 ? '' : ` ${copyId}`})`
    }
}

function *duplicateNames(initial: string): Iterable<string> {
    let counter = 1;
    while(true){
        yield createNewName();
        counter++;
    }
    function createNewName(){
        return `${initial} (${counter})`
    }
}

async function generateAvailableName(repository: CvRepository, initial: string, nameSequence: (initial: string) => Iterable<string>): Promise<string>{
    let newName = initial;
    const otherNewNames = nameSequence(initial)[Symbol.iterator]();
    while(await repository.hasCvByName(newName)){
        newName = otherNewNames.next().value;
    }
    return newName;
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
            const newName = await generateAvailableName(repository, original.name, copyNames);
            const newCv: CvRecord = {name: newName, cv: original.cv};
            await storeCv(newCv, null);
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

        }
    }
    async function storeCv({name, cv}: CvRecord, id: string | null): Promise<StorableCv> {
        const newId = id || createCvId();
        const newName = id === null ? await generateAvailableName(repository, name, duplicateNames) : name;
        const newStorableCv: StorableCv = {name: newName, cv, id: newId};
        await repository.storeCv(newStorableCv);
        return newStorableCv;
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