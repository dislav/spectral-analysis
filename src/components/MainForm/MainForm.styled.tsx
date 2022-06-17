import styled from 'styled-components';
import {
    MenuItem as MUIMenuItem,
    Alert as MUIAlert,
    formControlClasses,
    menuItemClasses,
    selectClasses,
    buttonClasses,
    alertClasses,
} from '@mui/material';

import { Breakpoint, up } from '@styles/breakpoints';

import GroupComponent from '../Group/Group';
import SelectComponent from './Select/Select';
import ButtonComponent from '@components/Button/Button';

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

    & .${buttonClasses.root} {
        width: 100%;
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

export const UploadDescription = styled.div`
    display: flex;
    align-items: center;
    color: #595959;
    font-size: 14px;
    line-height: 1.2;
    margin-bottom: 10px;
    order: -1;

    svg {
        width: 20px;
        height: 20px;
        margin-left: 4px;
        cursor: pointer;
    }

    ${up(Breakpoint.LG)} {
        margin-bottom: 0;
        margin-left: 14px;
        order: inherit;
    }
`;

export const Footer = styled.div`
    display: flex;
    flex-direction: column;

    & .${buttonClasses.root} {
        width: 100%;
        margin-bottom: 12px;

        &:last-child {
            margin-right: 0;
            margin-bottom: 0;
        }

        ${up(Breakpoint.LG)} {
            width: auto;
            margin-bottom: 0;
            margin-right: 20px;
        }
    }

    ${up(Breakpoint.LG)} {
        flex-direction: row;
        align-items: center;
    }
`;

export const ClearButton = styled(ButtonComponent)`
    &.${buttonClasses.root} {
        margin-left: auto;
    }
`;

export const Alert = styled(MUIAlert)`
    &.${alertClasses.root} {
        margin-top: 24px;
    }
`;
