import styled from 'styled-components';
import {
    MenuItem as MUIMenuItem,
    formControlClasses,
    selectClasses,
    menuItemClasses,
} from '@mui/material';

import GroupComponent from '../Group/Group';
import SelectComponent from './Select/Select';

export const Container = styled(GroupComponent)`
    margin-bottom: 60px;
`;

export const Group = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & .${formControlClasses.root} {
        margin-right: 20px;

        &:last-child {
            margin-right: 0;
        }
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
