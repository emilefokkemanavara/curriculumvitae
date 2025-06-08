import { createContext } from '@lit/context';
import { JsonEditor } from './json-editor';

export const jsonEditorContext = createContext<JsonEditor | undefined>('jsonEditor');