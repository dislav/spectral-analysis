import React from 'react';

import { Container, Label, Description, Content } from './Group.styled';

interface IGroup {
    className?: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
}

const Group: React.FC<IGroup> = ({
    className,
    label,
    description,
    children,
}) => {
    return (
        <Container className={className}>
            {label && <Label>{label}</Label>}
            <Content>
                {description && <Description>{description}</Description>}
                {children}
            </Content>
        </Container>
    );
};

export default Group;
