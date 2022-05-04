import styled from 'styled-components';
import { buttonClasses } from '@mui/material';

export const Container = styled.label`
    display: flex;

    input {
        display: none;
    }

    & .${buttonClasses.root} {
        min-width: 160px;
        height: 40px;
    }
`;
