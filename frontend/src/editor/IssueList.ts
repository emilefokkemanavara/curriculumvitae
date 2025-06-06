import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ValidationIssue } from './validation'

@customElement('issue-list')
export class IssueList extends LitElement {
    static styles = css`
    pre {
        display: inline;
        padding: 0 5px 0 5px;
    }
    `

    @property()
    issues: ValidationIssue[]

    renderIssue(issue: ValidationIssue) {
        if(issue.type === 'general'){
            return issue.message;
        }else if(issue.type === 'missing_property'){
            return html`<span><pre>${issue.propertyPath}</pre> ontbreekt (moet <pre>${issue.expectedType}</pre> zijn)</span>`
        }else if (issue.type === 'wrong_type'){
            if(issue.propertyPath.length === 0){
                return html`<span>Moet <pre>${issue.expectedType}</pre> zijn</span>`
            }
            return html`<span><pre>${issue.propertyPath}</pre> moet <pre>${issue.expectedType}</pre> zijn</span>`
        }
    }

    render() {
        return html`<ul>${(this.issues || []).map(i => html`<li>${this.renderIssue(i)}</li>`)}</ul>`
    }
}