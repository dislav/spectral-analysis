import React from 'react';
import {
    FormControlLabelProps,
    RadioProps,
    Radio as MUIRadio,
} from '@mui/material';

import { Container } from './Radio.styled';

const Radio: React.FC<RadioProps & Omit<FormControlLabelProps, 'control'>> = (
    props
) => {
    return <Container {...props} control={<MUIRadio />} />;
};

export default Radio;
