import { JsonEditor } from "./json-editor";
import { ZodError, ZodType } from 'zod'

export type GeneralValidationIssue = {
    type: 'general'
    message: string
}

export type MissingPropertyIssue = {
    type: 'missing_property'
    propertyPath: (string | number)[]
    expectedType: string
}

export type WrongTypeIssue = {
    type: 'wrong_type'
    propertyPath: (string | number)[]
    expectedType: string
}


export type ValidationIssue = GeneralValidationIssue | MissingPropertyIssue | WrongTypeIssue

function *mapZodIssues(zodError: ZodError): Iterable<ValidationIssue> {
    for(const issue of zodError.issues){
        if(issue.code === 'invalid_type'){
            if(issue.received === 'undefined'){
                yield {
                    type: 'missing_property',
                    propertyPath: issue.path,
                    expectedType: issue.expected
                }
            }else{
                yield {
                    type: 'wrong_type',
                    propertyPath: issue.path,
                    expectedType: issue.expected
                }
            }
        }
    }
}
export function validate(editor: JsonEditor, schema: ZodType): ValidationIssue[] {
    const value = editor.getValue();
    if(!value || editor.hasErrors()){
        return [
            {
                type: 'general',
                message: 'Geen geldige JSON'
            }
        ]
    }
    const parsed = JSON.parse(value);
    const zodParsed = schema.safeParse(parsed);
    if(zodParsed.success){
        return [];
    }
    return [...mapZodIssues(zodParsed.error)]
}