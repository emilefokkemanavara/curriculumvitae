import { performDbRequest } from "./perform-db-request";

type CreateObjectStore = IDBDatabase['createObjectStore']

function waitForTransactionToComplete(transaction: IDBTransaction): Promise<void> {
    return new Promise<void>((res, rej) => {
        transaction.addEventListener('complete', successHandler);
        transaction.addEventListener('abort', errorHandler);
        transaction.addEventListener('error', errorHandler);
        const timeoutTimeout = setTimeout(() => {
            console.log('After two seconds, the transaction still did not emit any events. It must have already completed.');
            res();
        }, 2000);
        function errorHandler(err: unknown): void {
            clearTimeout(timeoutTimeout);
            removeListeners();
            rej(err);
        }
        function successHandler(): void {
            console.log('transaction complete')
            clearTimeout(timeoutTimeout);
            removeListeners();
            res();
        }
        function removeListeners(): void {
            transaction.removeEventListener('complete', successHandler);
            transaction.removeEventListener('abort', errorHandler);
            transaction.removeEventListener('error', errorHandler);
        }
    })
}
export async function openOrCreateDb(name: string, createSchema: (createObjectStore: CreateObjectStore) => void): Promise<IDBDatabase> {
    return performDbRequest<IDBDatabase, IDBOpenDBRequestEventMap, IDBOpenDBRequest>(
        () => globalThis.indexedDB.open(name), {
            error: true,
            blocked: true,
            upgradeneeded: async (ev, db) => {
                let transaction: IDBTransaction | undefined;
                createSchema((...args) => {
                    const store = db.createObjectStore(...args);
                    if(transaction === undefined){
                        transaction = store.transaction;
                    }else if(store.transaction !== transaction){
                        console.log('created another object store but this one has a different transaction!')
                    }
                    return store;
                });
                if(transaction){
                    await waitForTransactionToComplete(transaction);
                }
            }
        });
}