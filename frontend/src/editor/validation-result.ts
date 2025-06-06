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

export type SuccessValidationResult<T> = {
    success: true
    value: T
}

export type FailureValidationResult = {
    success: false
    issues: ValidationIssue[]
}

export type ValidationResult<T> = SuccessValidationResult<T> | FailureValidationResult