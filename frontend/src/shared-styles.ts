import { css } from 'lit';

export const buttonStyles = css`
    button, .button-like {
        background-color: transparent;
        border: none;
        font-size: 1.5em;
        text-align: center;
    }
    button:hover, .button-like:hover {
        background-color: var(--lightgrey);
    }

    button:disabled{
        opacity: .5;
    }
`