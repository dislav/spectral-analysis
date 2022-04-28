import styled from 'styled-components';

export const Container = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e0e0e0;
    height: 80px;
    padding: 0 40px;
    z-index: 10;
`;

export const Title = styled.span`
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
`;
