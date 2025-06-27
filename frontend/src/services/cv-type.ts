import { ZodType } from "zod";
import navaraCvSchemaUrl from '/schemas/navara-cv.json?url';
import { CvSchema as NavaraCvSchema, type Cv as NavaraCv } from "navara-cv";
import { html, TemplateResult } from "lit";

export interface CvType {
    schema: ZodType
    jsonSchemaUrl: string
    render(cv: unknown): TemplateResult
}

export function getCvType(): CvType {
    return {
        schema: NavaraCvSchema,
        jsonSchemaUrl: new URL(navaraCvSchemaUrl, window.location.href).toString(),
        render(cv: unknown){
            return html`<navara-cv .cv=${cv as NavaraCv}></navara-cv>`
        }
    }
}