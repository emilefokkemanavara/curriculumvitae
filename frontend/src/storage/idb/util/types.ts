export type ContinueCursorInstruction = { 
    type: 'continue',
    key?: IDBValidKey
};
export type AdvanceCursorInstruction = {
    type: 'advance',
    count: number
};
export type ContinuePrimaryKeyCursorInstruction = {
    type: 'continue_primary_key',
    key: IDBValidKey,
    primaryKey: IDBValidKey
};
export type CursorInstruction = ContinueCursorInstruction | AdvanceCursorInstruction | ContinuePrimaryKeyCursorInstruction;

export type DbStoreIndexDefinition = Partial<IDBIndexParameters> & {
    keyPath: string | string[]
}
export type DbStoreDefinition = IDBObjectStoreParameters & {
    indexes?: {
        [name: string]: DbStoreIndexDefinition
    }
}
export type DbDefinition = {
    [storeName: string]: DbStoreDefinition
}

export type DbStoreIndex = {
    read(
        query?: IDBValidKey | IDBKeyRange | null,
        direction?: IDBCursorDirection
    ): AsyncIterable<any, void, CursorInstruction | undefined>
    count(query?: IDBValidKey | IDBKeyRange): Promise<number>
}
export type DbStore<TStoreDefinition extends DbStoreDefinition = DbStoreDefinition> =  {
    get(query: IDBValidKey | IDBKeyRange): Promise<any>
    put(value: any, key?: IDBValidKey): Promise<IDBValidKey>
    delete(query: IDBValidKey | IDBKeyRange): Promise<void>
    readKeys(
        query?: IDBValidKey | IDBKeyRange | null,
        direction?: IDBCursorDirection
    ): AsyncIterable<any, void, CursorInstruction | undefined>
    count(query?: IDBValidKey | IDBKeyRange): Promise<number>
} & (
    TStoreDefinition extends {indexes: infer R} 
    ? {
        indexes: {
            [indexName in keyof R]: DbStoreIndex
        }
    }
    : {}
);
export type Db<TDbDefinition extends DbDefinition> = {
    [storeName in keyof TDbDefinition]: TDbDefinition[storeName] extends DbStoreDefinition
        ? DbStore<TDbDefinition[storeName]>
        : never
};