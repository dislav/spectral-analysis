import React from 'react';
import { Button } from '@mui/material';

import { Container } from './Upload.styled';

interface IUpload
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    className?: string;
    fileName?: string | null;
}

const Upload = React.forwardRef<HTMLInputElement, IUpload>(
    ({ className, fileName, ...props }, ref) => {
        return (
            <Container className={className}>
                <input type="file" {...props} ref={ref} />
                <Button
                    variant="contained"
                    color={fileName ? 'inherit' : 'primary'}
                    component="span"
                    disableElevation
                >
                    {fileName || 'Выберите файл'}
                </Button>
            </Container>
        );
    }
);

export default Upload;
