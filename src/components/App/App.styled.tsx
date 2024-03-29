import styled from 'styled-components';

import { Breakpoint, up } from '@styles/breakpoints';

import GroupComponent from '@components/Group/Group';
import Tooltip from '@components/App/Tooltip/Tooltip';

export const Container = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;

    ${up(Breakpoint.LG)} {
        padding: 60px 0;
    }
`;

export const Group = styled(GroupComponent)`
    margin-bottom: 40px;

    ${up(Breakpoint.LG)} {
        margin-bottom: 60px;
    }
`;

export const Label = styled.div`
    display: flex;
    align-items: center;
`;

export const TooltipApp = styled(Tooltip)`
    margin-left: 4px;
`;
