import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

window.MonacoEnvironment = {
    getWorker(_, label: string){
        if (label === 'json') {
            return new jsonWorker()
        }
        return new editorWorker()
    }
};

export interface JsonEditorEventMap {
    changed: Event
}

export interface JsonEditor{
    getValue(): any
    setValue(value: unknown): void
    hasErrors(): boolean
    addEventListener<K extends keyof JsonEditorEventMap>(type: K, listener: (ev: JsonEditorEventMap[K]) => void): void
    removeEventListener<K extends keyof JsonEditorEventMap>(type: K, listener: (ev: JsonEditorEventMap[K]) => void): void
}

export async function createJsonEditor(domElement: HTMLElement, schemaUrl: string): Promise<JsonEditor> {
    const eventTarget = new EventTarget();
    const { editor, MarkerSeverity, languages } = await import('monaco-editor');
    const model = editor.createModel('', 'json');
    editor.create(domElement, {
        language: 'json',
        model
    });
    languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [
            {
                uri: schemaUrl,
                fileMatch: ['*.json']
            }
        ],
        enableSchemaRequest: true
    });
    model.onDidChangeContent(() => {
        const event = new CustomEvent('changed');
        eventTarget.dispatchEvent(event);
    })
    setValue({})
    return {
        getValue(){
            if(!model || hasErrors()){
                return undefined;
            }
            const text = model.getValue();
            if(!text){
                return undefined;
            }
            const parsed = JSON.parse(text);
            if(typeof parsed !== 'object'){
                return parsed;
            }
            const {$schema, ...rest} = parsed;
            return rest;
        },
        setValue,
        hasErrors,
        addEventListener(type, listener) {
            eventTarget.addEventListener(type, listener)
        },
        removeEventListener(type, listener) {
            eventTarget.removeEventListener(type, listener);
        },
    }
    function hasErrors(){
        if(!model){
            return false;
        }
        const markers = editor.getModelMarkers({
            resource: model.uri
        });
        return markers.some(m => m.severity === MarkerSeverity.Error);
    }
    function setValue(value: object){
        const modified = {$schema: schemaUrl, ...value}
        const stringified = JSON.stringify(modified, null, 2);
        model?.setValue(stringified);
    }
}