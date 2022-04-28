import React from 'react';
import {
    InputLabel,
    SelectProps,
    Select as MUISelect,
    MenuItem,
} from '@mui/material';

import { Option } from './types';

import { Container } from './Select.styled';

export interface ISelect extends Omit<SelectProps, 'children'> {
    options: Option[];
    renderOption?: (option: Option) => React.ReactNode;
}

const Select = React.forwardRef<any, ISelect>(
    ({ label, options, renderOption, ...props }, ref) => {
        return (
            <Container fullWidth>
                {label && <InputLabel>{label}</InputLabel>}
                <MUISelect label={label} {...props} ref={ref}>
                    {options.map(
                        (option) =>
                            renderOption?.(option) ?? (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            )
                    )}
                </MUISelect>
            </Container>
        );
    }
);

export default Select;
