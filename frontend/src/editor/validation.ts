import { JsonEditor } from "./json-editor";
import { ZodError, ZodType } from 'zod'
import { ValidationIssue, ValidationResult } from "./validation-result";

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
export function validate<T>(editor: JsonEditor, schema: ZodType<T>): ValidationResult<T> {
    const value = editor.getValue();
    if(!value || editor.hasErrors()){
        return {
            success: false,
            issues: [
                {
                    type: 'general',
                    message: 'Geen geldige JSON'
                }
            ]
        }
    }
    const parsed = JSON.parse(value);
    const zodParsed = schema.safeParse(parsed);
    if(zodParsed.success){
        return {success: true, value: zodParsed.data };
    }
    return {
        success: false,
        issues: [...mapZodIssues(zodParsed.error)]
    }
}