interface Emitter<TMap> {
    addEventListener<TKey extends keyof TMap>(key: TKey, listener: (ev: TMap[TKey] & Event) => void): void
    removeEventListener<TKey extends keyof TMap>(key: TKey, listener: (ev: TMap[TKey] & Event) => void): void
}

type ErrorEventHandling<TEvent, TAdditionalArgs extends unknown[]> = ((event: TEvent, ...additional: TAdditionalArgs) => void | Promise<void>) | true 
type ErrorEventHandlingMap<TEventMap, TAdditionalArgs extends unknown[]> = {[key in keyof TEventMap]?: ErrorEventHandling<TEventMap[key], TAdditionalArgs>}


export function performDbRequest<
    TResult,
    TMap,
    TRequest extends IDBRequest<TResult> & Emitter<TMap>
>(
    fn: () => TRequest,
    errorEvents: ErrorEventHandlingMap<TMap, [TResult]>
): Promise<TResult> {
    return new Promise<TResult>(async (res, rej) => {
        try{
            const req = fn();

            req.addEventListener('success', successCallback);
            for(const errorEvent in errorEvents){
                req.addEventListener(errorEvent, errorCallback);
            }
            async function errorCallback(ev: TMap[keyof TMap] & Event): Promise<void> {
                removeListeners();
                const eventType = ev.type;
                const handling = errorEvents[eventType as keyof TMap] as ErrorEventHandling<TMap[keyof TMap], [TResult]>;
                if(handling === true){
                    rej(req.error);
                }else{
                    const result = req.result;
                    try{
                        await handling(ev, result);
                        res(result);
                    }catch(e){
                        rej(e);
                    }
                }
            }
            function successCallback(): void {
                removeListeners();
                res(req.result);
            }
            function removeListeners(): void {
                req.removeEventListener('success', successCallback);
                for(const errorEvent in errorEvents){
                    req.removeEventListener(errorEvent, errorCallback);
                }
            }
        }catch(e){
            rej(e);
        }
        
    });
}