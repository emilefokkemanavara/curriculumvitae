import { createDbStoreIndex } from "./create-db-store-index";
import { iterateCursor } from "./iterate-cursor";
import { performSimpleDbRequest } from "./perform-db-request";
import { DbStore, DbStoreDefinition, DbStoreIndex } from "./types";

export function createDbStore(
    openDbIfExists: () => Promise<IDBDatabase | undefined>,
    openOrCreateDb: () => Promise<IDBDatabase>,
    storeName: string,
    storeDefinition: DbStoreDefinition
): DbStore<DbStoreDefinition> {
    let indexes: {[name: string]: DbStoreIndex} = {};
    if(storeDefinition.indexes){
        for(const indexName in storeDefinition.indexes){
            if(!Object.hasOwn(storeDefinition.indexes, indexName)){
                continue;
            }
            indexes[indexName] = createDbStoreIndex(openDbIfExists, getStore, indexName);
        }
    }
    const result: DbStore<DbStoreDefinition & {indexes: {}}> = {
        indexes,
        async get(id){
            const db = await openDbIfExists();
            if(!db){
                return undefined;
            }
            try {
                return await performSimpleDbRequest(() => getStore(db, 'readonly').get(id))
            } finally {
                db.close();
            }
        },
        async put(value, key) {
            const db = await openOrCreateDb();
            try{
                return await performSimpleDbRequest(() => getStore(db, 'readwrite').put(value, key));
            }finally{
                db.close();
            }
        },
        async *readKeys(query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection){
            const db = await openDbIfExists();
            if(!db){
                return;
            }
            try{
                yield* iterateCursor(
                    () => getStore(db, 'readwrite').openKeyCursor(query, direction),
                    c => c.key
                )
            }finally{
                db.close();
            }
        },
        async delete(query){
            const db = await openDbIfExists();
            if(!db){
                return;
            }
            try{
                await performSimpleDbRequest(() => getStore(db, 'readwrite').delete(query))
            }finally{
                db.close();
            }
        }
    }
    function getStore(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
        return db.transaction(storeName, mode).objectStore(storeName);
    }
    return result;
}