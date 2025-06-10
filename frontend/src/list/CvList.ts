import { LitElement, html, css } from 'lit';
import {Task} from '@lit/task';
import { customElement, property, state } from 'lit/decorators.js';
import { buttonStyles } from '../shared-styles';
import { provide } from '@lit/context';
import { Dependencies } from './dependencies';
import { dependenciesContext } from './dependencies-context';
import { fullEditorUrl } from '../constants';
import { CvSummary } from '../services/cv-service';

@customElement('cv-list')
export class CvList extends LitElement {
    static styles = [buttonStyles, css`
        .body {
            height: 100%;
        }
        .header {
            padding: 1em;
            border-width: 0 0 1px 0;
            border-style: solid;
            border-color: var(--darkblue);
            height: 2em;
        }
        .title {
            text-transform: uppercase;
        }
        .loading-container {
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .loading-message {
            flex-grow: 1;
            text-align: center;
        }
    `]

    @provide({context: dependenciesContext})
    @property({type: Object})
    public dependencies: Dependencies | undefined;

    @state()
    private summaries: CvSummary[] = [];

    private task = new Task(this, {
        task: async ([deps]) => {
            if(!deps){
                return;
            }
            const summaries = await deps.cvService.getAllCvs();
            this.summaries = summaries;
        },
        args: () => [this.dependencies]
    })

    private async doDelete(cvId: string): Promise<void> {
        if(!this.dependencies){
            return;
        }
        await this.dependencies.cvService.deleteCv(cvId);
        this.task.run();
    }

    private async copy(id: string): Promise<void> {
        if(!this.dependencies){
            return;
        }
        await this.dependencies.cvService.copyCv(id);
        this.task.run();
    }

    render(){
        return html`
            <cv-app-layout>
                <div class="header" slot="header-left">
                    <span class="title">curriculumvitae</span>
                </div>
                <div class="header" slot="header-right">
                    <form action="${fullEditorUrl}" method="get">
                        <button type="submit">Nieuw</button>
                    </form>
                </div>
                <div slot="body" class="body">
                    ${this.task.render({
                        complete: () => this.summaries.length === 0
                            ? html`
                                <div class="loading-container">
                                    <div class="loading-message">
                                        Geen CVs.
                                    </div>
                                </div>
                            `
                            : this.summaries.map(s => html`
                                <cv-list-item
                                    .summary=${s}
                                    @deleterequested=${() => this.doDelete(s.id)}
                                    @copyrequested=${() => this.copy(s.id)}>
                                </cv-list-item>
                                `),
                        pending: () => html`
                            <div class="loading-container">
                                <div class="loading-message">
                                    Laden...
                                </div>
                            </div>
                            `,
                        error: () => html`<span>Error!</span>`
                    })}
                </div>
            </cv-app-layout>
        `
    }
}