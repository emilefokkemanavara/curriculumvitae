import { CursorInstruction } from "./types";

export function iterateCursor<TCursor extends IDBCursor, TValue>(
    start: () => IDBRequest<TCursor | null>,
    valueSelector: (cursor: TCursor) => TValue
): AsyncIterable<TValue, void, CursorInstruction | undefined> {
    let { resolve, reject, promise } = Promise.withResolvers<IteratorResult<any, void>>();
    let idbRequest: IDBRequest<TCursor | null> | undefined;
    function next(value?: CursorInstruction): Promise<IteratorResult<any, void>> {
        if(!idbRequest){
            idbRequest = start();
            idbRequest.addEventListener('success', successListener);
            idbRequest.addEventListener('error', errorListener);
        }else{
            const cursor = idbRequest.result;
            if(cursor){
                applyInstruction(cursor, value);
            }
        }
        return promise;
    }
    async function close(): Promise<IteratorReturnResult<void>>{
        if(idbRequest){
            idbRequest.removeEventListener('success', successListener);
            idbRequest.removeEventListener('error', errorListener);
        }
        return Promise.resolve({done: true, value: undefined})
    }
    function applyInstruction(cursor: TCursor, instruction: CursorInstruction | undefined): void {
        if(!instruction){
            cursor.continue();
            return;
        }
        switch(instruction.type){
            case 'advance': return cursor.advance(instruction.count);
            case 'continue': return cursor.continue(instruction.key);
            case 'continue_primary_key': return cursor.continuePrimaryKey(instruction.key, instruction.primaryKey)
        }
    }
    function successListener(): void {
        if(!idbRequest){
            return;
        }
        const cursor = idbRequest.result;
        const previousResolve = resolve;
        ({ resolve, reject, promise} = Promise.withResolvers<IteratorResult<any, void>>());
        if(!cursor){
            previousResolve({done: true, value: undefined})
        }else{
            previousResolve({done: false, value: valueSelector(cursor)})
        }
    }
    function errorListener(){
        if(!idbRequest){
            return;
        }
        reject(idbRequest.error);
    }
    const iterator: AsyncIterator<any, void, CursorInstruction | undefined> = { next, return: close, throw: close };
    return {
        [Symbol.asyncIterator](){
            return iterator;
        }
    }
}