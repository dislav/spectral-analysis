import React from 'react';

import { Container, Title } from './Header.styled';

interface IHeader {
    className?: string;
}

const Header: React.FC<IHeader> = ({ className }) => {
    return (
        <Container className={className}>
            <Title>Спектральный анализ</Title>
        </Container>
    );
};

export default Header;
