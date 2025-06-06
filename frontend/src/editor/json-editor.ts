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

export interface JsonEditor{
    getValue(): string
    hasErrors(): boolean
}

export async function createJsonEditor(): Promise<JsonEditor> {
    const { editor, MarkerSeverity } = await import('monaco-editor');
    const monacoEditor = editor.create(document.getElementById('editor-panel')!, {
        language: 'json'
    });
    const model = monacoEditor.getModel();
    return {
        getValue(){
            if(!model){
                return '';
            }
            return model.getValue();
        },
        hasErrors(){
            if(!model){
                return false;
            }
            const markers = editor.getModelMarkers({
                resource: model.uri
            });
            return markers.some(m => m.severity === MarkerSeverity.Error);
        }
    }
}