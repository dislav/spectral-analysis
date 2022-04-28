import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { FormFields } from '../types';
import SelectComponent, { ISelect } from '../../Select/Select';

const Select: React.FC<ISelect & UseControllerProps<FormFields>> = ({
    name,
    control,
    rules,
    defaultValue = '',
    ...props
}) => {
    const { field } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    return <SelectComponent {...props} {...field} />;
};

export default Select;
