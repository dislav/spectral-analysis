import styled from 'styled-components';
import {
    formControlClasses,
    MenuItem as MUIMenuItem,
    menuItemClasses,
    selectClasses,
} from '@mui/material';

import GroupComponent from '../Group/Group';
import SelectComponent from './Select/Select';
import { Breakpoint, up } from '@styles/breakpoints';

export const Container = styled(GroupComponent)`
    margin-bottom: 60px;
`;

export const Group = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    & .${formControlClasses.root} {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
            margin-right: 0;
        }

        ${up(Breakpoint.MD)} {
            margin-bottom: 0;
            margin-right: 20px;
        }
    }

    ${up(Breakpoint.MD)} {
        flex-direction: row;
        align-items: center;
    }
`;

export const Select = styled(SelectComponent)`
    & .${selectClasses.select} {
        span {
            display: none;
        }
    }
`;

export const MenuItem = styled(MUIMenuItem)`
    & .${menuItemClasses.root} {
        display: flex;
        align-items: center;
    }
`;

export const CompanyCode = styled.span`
    color: #a2a2a2;
    margin-left: auto;
`;

export const Description = styled.div`
    font-size: 14px;
    line-height: 1.5;

    ${up(Breakpoint.LG)} {
        font-size: 16px;
        line-height: 1.3;
    }
`;
