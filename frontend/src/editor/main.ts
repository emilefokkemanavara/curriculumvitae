import '../shared.css'
import './index.css'
import './Editor';
import type { Editor } from './Editor'
import { waitForAppearanceOf } from '../utils/wait-for-appearance-of';
import { createJsonEditor } from './json-editor';
import { fullCvSchemaUrl } from './get-full-schema-url';

async function main(): Promise<void> {
    const jsonEditorEl = document.getElementById('json-editor')!;
    const editorEl = document.getElementById('cv-editor')! as Editor;
    await waitForAppearanceOf(jsonEditorEl);
    const jsonEditor = await createJsonEditor(jsonEditorEl, fullCvSchemaUrl);
    editorEl.jsonEditor = jsonEditor;
}

main();