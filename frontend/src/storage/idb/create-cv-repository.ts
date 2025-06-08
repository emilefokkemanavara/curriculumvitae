import { CvRepository } from "../cv-repository";
import { openOrCreateDb } from "./util/open-or-create-db";
import { performDbRequest } from "./util/perform-db-request";

const CVS_OBJECT_STORE_NAME = 'cvs';

function openDb(): Promise<IDBDatabase> {
    return openOrCreateDb('curriculumvitae', (createObjectStore) => {
        const store = createObjectStore(CVS_OBJECT_STORE_NAME, {keyPath: 'id'});
        store.createIndex('name', 'name');
    })
}

export function createCvRepository(): CvRepository {    
    return {
        async storeCv(cv){
            console.log('about to store', cv)
            const db = await openDb();
            const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
            const putResult = await performDbRequest<IDBValidKey, IDBRequestEventMap, IDBRequest<IDBValidKey>>(
                () => store.put(cv),
                {error: true}
            );
            console.log('did put into db', putResult)
        },
        async getCv(id) {
            console.log('getting cv by id', id)
            const db = await openDb();
            const transaction = db.transaction(CVS_OBJECT_STORE_NAME, 'readonly');
            const store = transaction.objectStore(CVS_OBJECT_STORE_NAME);
            const result = await performDbRequest<any, IDBRequestEventMap, IDBRequest<any>>(
                () => store.get(id),
                {error: true}
            );
            return result;
        },
    }
}