import React, { useState } from 'react';
import { TooltipProps } from '@mui/material';
import { useMediaQuery } from 'react-responsive';

import { Breakpoint, breakpoints } from '@styles/breakpoints';

import { Container, Title } from './Tooltip.styled';

const Info = (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
        <path
            d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
        />
    </svg>
);

type ITooltip = Omit<TooltipProps, 'children'> & {
    children?: React.ReactElement<any, any>;
};

const Tooltip: React.FC<ITooltip> = ({
    title,
    children,
    onOpen,
    onClose,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: breakpoints[Breakpoint.MD] });

    const onOpenHandler = (e: React.SyntheticEvent<Element, Event>) => {
        setIsOpen(true);
        onOpen?.(e);
    };

    const onCloseHandler = (
        e: Event | React.SyntheticEvent<Element, Event>
    ) => {
        setIsOpen(false);
        onClose?.(e);
    };

    return (
        <Container
            title={<Title>{title}</Title>}
            placement={isMobile ? 'bottom' : 'right'}
            open={isOpen}
            onOpen={onOpenHandler}
            onClose={onCloseHandler}
            arrow
            {...props}
        >
            <span onClick={onOpenHandler}>{children ?? Info}</span>
        </Container>
    );
};

export default Tooltip;
