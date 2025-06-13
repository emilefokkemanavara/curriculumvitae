import { createDbStore } from "./create-db-store";
import { 
    openDbIfExists as openIdbDbIfExists,
    openOrCreateDb as openOrCreateIdbDb,
} from "./open-or-create-db";
import { Db, DbDefinition } from "./types";

export function createDb<TDbDefinition extends DbDefinition>(name: string, definition: TDbDefinition): Db<TDbDefinition> {
    const result = {} as Db<TDbDefinition>;
    for(const storeName in definition){
        if(!Object.hasOwn(definition, storeName)){
            continue;
        }
        result[storeName] = createDbStore(
            openDbIfExists,
            openOrCreateDb,
            storeName,
            definition[storeName]
        ) as Db<TDbDefinition>[keyof TDbDefinition];
    }
    function openDbIfExists(): Promise<IDBDatabase | undefined> {
        return openIdbDbIfExists(name)
    }
    function openOrCreateDb(): Promise<IDBDatabase> {
        return openOrCreateIdbDb(name, (createObjectStore) => {
            for(const storeName in definition){
                if(!Object.hasOwn(definition, storeName)){
                    continue;
                }
                const { indexes, ...rest} = definition[storeName];
                const store = createObjectStore(storeName, rest);
                if(!indexes){
                    continue;
                }
                for(const indexName in indexes){
                    if(!Object.hasOwn(indexes, indexName)){
                        continue;
                    }
                    const { keyPath, ...rest} = indexes[indexName];
                    store.createIndex(indexName, keyPath, rest);
                }
            }
        })
    }
    return result;
}