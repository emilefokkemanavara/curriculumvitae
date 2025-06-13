import { iterateCursor } from "./iterate-cursor";
import { performSimpleDbRequest } from "./perform-db-request";
import { DbStoreIndex } from "./types";

export function createDbStoreIndex(
    openDbIfExists: () => Promise<IDBDatabase | undefined>,
    getStore: (db: IDBDatabase, mode: IDBTransactionMode) => IDBObjectStore,
    indexName: string
): DbStoreIndex {
    return {
        async count(query) {
            const db = await openDbIfExists();
            if(!db){
                return 0;
            }
            try{
                return await performSimpleDbRequest(() => getStore(db, 'readonly').index(indexName).count(query))
            }finally{
                db.close();
            }
        },
        async *read(query, direction) {
            const db = await openDbIfExists();
            if(!db){
                return;
            }
            try {
                yield* iterateCursor(() => getStore(db, 'readonly').index(indexName).openCursor(query, direction));
            } finally {
                db.close();
            }
        },
    }
}