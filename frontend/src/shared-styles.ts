import { css } from 'lit';

export const buttonStyles = css`
    button {
        font-family: "Be Vietnam Pro";
        color: var(--darkblue);
        background-color: var(--lightgrey);
        border-color: var(--darkblue);
        border-radius: 3px;
        border-width: 1px;
        font-size: 1em;
    }

    button:active {
        border-color: var(--lightblue);
    }

    button:disabled{
        opacity: .5;
    }
`