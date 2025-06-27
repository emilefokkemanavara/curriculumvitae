import { ZodError, ZodIssueCode, ZodParsedType, ZodType } from 'zod'
import { ValidationIssue, ValidationResult } from "./validation-result";

function *mapZodIssues(zodError: ZodError): Iterable<ValidationIssue> {
    for(const issue of zodError.issues){
        if(issue.code === ZodIssueCode.invalid_type){
            if(issue.received === ZodParsedType.undefined){
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
        }else if(issue.code === ZodIssueCode.too_small){
            yield {
                type: 'too_little',
                propertyPath: issue.path,
                minimum: issue.minimum
            }
        }else if(issue.code === ZodIssueCode.invalid_literal){
            yield {
                type: 'wrong_type',
                propertyPath: issue.path,
                expectedType: JSON.stringify(issue.expected)
            }
        }
    }
}
export function validateZod<T>(value: unknown, schema: ZodType<T>): ValidationResult<T> {
    const zodParsed = schema.safeParse(value);
    if(zodParsed.success){
        return {success: true, value: zodParsed.data };
    }
    return {
        success: false,
        issues: [...mapZodIssues(zodParsed.error)]
    }
}