import { createContext } from '@lit/context';
import { Dependencies } from './dependencies';

export const dependenciesContext = createContext<Dependencies | undefined>('dependencies');