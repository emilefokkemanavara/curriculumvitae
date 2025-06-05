import '../shared.css'
import './index.css'
import { editor } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

window.MonacoEnvironment = {
    getWorker(_, label: string){
		if (label === 'json') {
            return new jsonWorker()
        }
        return new editorWorker()
    }
}

function main(): void {
    const jsonEditor = editor.create(document.getElementById('editor-panel'), {
        language: 'json'
    })
}

main();