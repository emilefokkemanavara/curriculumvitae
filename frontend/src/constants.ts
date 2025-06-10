import cvSchemaUrl from '/cv-schema.json?url';
import editorUrl from '/editor/index.html?url';

export const fullCvSchemaUrl = new URL(cvSchemaUrl, window.location.href).toString();
export const fullEditorUrl = new URL('.', new URL(editorUrl, window.location.href)).toString();