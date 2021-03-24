/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const Dropback = props => (
    <div
        css={css`
            position: fixed;
            min-height: 100vh;
            width: 100%;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.55);
        `}
    ></div>
);

export default Dropback;