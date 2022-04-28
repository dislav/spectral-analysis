import React from 'react';
import { ButtonProps } from '@mui/material';

import { Container, Loader } from './Button.styled';

interface IButton extends ButtonProps {
    isLoading?: boolean;
}

const Button: React.FC<IButton> = ({ isLoading, children, ...props }) => {
    return (
        <Container variant="outlined" {...props}>
            {isLoading ? <Loader size={18} /> : children}
        </Container>
    );
};

export default Button;
