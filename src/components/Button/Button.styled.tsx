import styled from 'styled-components';
import { Button, CircularProgress, buttonClasses } from '@mui/material';

export const Container = styled(Button)`
    &.${buttonClasses.root} {
        min-width: 120px;
        height: 40px;
    }
`;

export const Loader = styled(CircularProgress)``;
