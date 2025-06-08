import cvSchemaUrl from '/cv-schema.json?url'

export const fullCvSchemaUrl = new URL(cvSchemaUrl, window.location.href).toString();