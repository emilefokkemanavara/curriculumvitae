import editorUrl from '/editor/index.html?url';
import cvUrl from '/cv/index.html?url'

export const fullEditorUrl = new URL('.', new URL(editorUrl, window.location.href)).toString();
export const fullCvUrl = new URL('.', new URL(cvUrl, window.location.href)).toString();