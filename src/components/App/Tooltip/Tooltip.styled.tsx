import styled from 'styled-components';
import { Tooltip } from '@mui/material';

export const Container = styled(Tooltip)`
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
`;

export const Title = styled.div`
    font-size: 13px;
    line-height: 1.4;
`;
