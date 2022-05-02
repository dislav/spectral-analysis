import styled from 'styled-components';

import GroupComponent from '@components/Group/Group';
import { Breakpoint, up } from '@styles/breakpoints';

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
