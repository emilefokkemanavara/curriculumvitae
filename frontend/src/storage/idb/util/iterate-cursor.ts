type ContinueCursorInstruction = { type: 'continue', key?: IDBValidKey };
type AdvanceCursorInstruction = { type: 'advance', count: number };
type ContinuePrimaryKeyCursorInstruction = { type: 'continue_primary_key', key: IDBValidKey, primaryKey: IDBValidKey };

export type CursorInstruction = ContinueCursorInstruction | AdvanceCursorInstruction | ContinuePrimaryKeyCursorInstruction;

export function iterateCursor<T>(start: () => IDBRequest<IDBCursorWithValue | null>): AsyncIterable<T, void, CursorInstruction | undefined> {
    let { resolve, reject, promise } = Promise.withResolvers<IteratorResult<T, void>>();
    let idbRequest: IDBRequest<IDBCursorWithValue | null> | undefined;
    function next(value?: CursorInstruction): Promise<IteratorResult<T, void>> {
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
    function applyInstruction(cursor: IDBCursorWithValue, instruction: CursorInstruction | undefined): void {
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
        ({ resolve, reject, promise} = Promise.withResolvers<IteratorResult<T, void>>());
        if(!cursor){
            previousResolve({done: true, value: undefined})
        }else{
            previousResolve({done: false, value: cursor.value})
        }
    }
    function errorListener(){
        if(!idbRequest){
            return;
        }
        reject(idbRequest.error);
    }
    const iterator: AsyncIterator<T, void, CursorInstruction | undefined> = { next, return: close, throw: close };
    return {
        [Symbol.asyncIterator](){
            return iterator;
        }
    }
}