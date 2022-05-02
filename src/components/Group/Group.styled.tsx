import styled from 'styled-components';
import { Breakpoint, up } from '@styles/breakpoints';

export const Container = styled.div`
    position: relative;
`;

export const Label = styled.span`
    position: absolute;
    top: 0;
    left: 28px;
    color: #5b5b5b;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    background: white;
    transform: translateY(-50%);
    padding: 0 4px;
`;

export const Description = styled.div`
    margin-bottom: 20px;

    ${up(Breakpoint.LG)} {
        margin-bottom: 40px;
    }
`;

export const Content = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 24px 20px 20px;

    ${up(Breakpoint.LG)} {
        padding: 32px;
    }
`;
