import { CvRepository, StorableCv } from "../cv-repository";
import { iterateCursor } from "./util/iterate-cursor";
import { 
    openOrCreateDb as openOrCreateIdbDb,
    openDbIfExists as openIdbDbIfExists
} from "./util/open-or-create-db";
import { performDbRequest } from "./util/perform-db-request";

const CVS_OBJECT_STORE_NAME = 'cvs';
const IDB_NAME = 'curriculumvitae';
const NAME_INDEX_NAME = 'name'

function openOrCreateDb(): Promise<IDBDatabase> {
    return openOrCreateIdbDb(IDB_NAME, (createObjectStore) => {
        const store = createObjectStore(CVS_OBJECT_STORE_NAME, {keyPath: 'id'});
        store.createIndex(NAME_INDEX_NAME, 'name');
    })
}

function openDbIfExists(): Promise<IDBDatabase | undefined> {
    return openIdbDbIfExists(IDB_NAME)
}

export function createCvRepository(): CvRepository {    
    return {
        async storeCv(cv){
            const db = await openOrCreateDb();
            try{
                const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
                await performDbRequest<IDBValidKey, IDBRequestEventMap, IDBRequest<IDBValidKey>>(
                    () => store.put(cv),
                    {error: true}
                );
            }finally{
                db.close();
            }

        },
        async deleteCv(id){
            const db = await openOrCreateDb();
            try{
                const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
                await performDbRequest<IDBValidKey, IDBRequestEventMap, IDBRequest>(
                    () => store.delete(id),
                    {error: true}
                );
            }finally{
                db.close();
            }
        },
        async getCv(id) {
            const db = await openDbIfExists();
            if(!db){
                return undefined;
            }
            try{
                const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readonly');
                const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
                return await performDbRequest<any, IDBRequestEventMap, IDBRequest<any>>(
                    () => store.get(id),
                    {error: true}
                );
            }finally{
                db.close();
            }
        },
        async hasCvByName(name) {
            const db = await openDbIfExists();
            if(!db){
                return false;
            }
            try {
                const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readonly');
                const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
                const index = store.index(NAME_INDEX_NAME);
                const iterator = iterateCursor<StorableCv>(() => index.openCursor(name));
                for await(const _ of iterator){
                    return true;
                }
                return false;
            } finally {
                db.close();
            }
        },
        async *getAllCvs() {
            const db = await openDbIfExists();
            if(!db){
                return [];
            }
            try{
                const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readonly');
                const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
                const index = store.index(NAME_INDEX_NAME);
                
                const iterator = iterateCursor<StorableCv>(() => index.openCursor());
                yield* iterator;
            }finally{
                db.close();
            }
        },
    }
}