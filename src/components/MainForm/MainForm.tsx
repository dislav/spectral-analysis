import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import {
    Company,
    FormFields,
    MoexQueryParams,
    Period,
} from '@components/MainForm/types';
import { Option } from '@components/Select/types';
import { Stock } from '@components/App/types';

import {
    Container,
    Group,
    Select,
    MenuItem,
    CompanyCode,
    Description,
} from './MainForm.styled';
import Button from '@components/Button/Button';
import { moexQuery } from '@components/MainForm/utils';
import { checkStationarity, getLinearCombination } from '@api/api';

interface IMainForm {
    className?: string;
    setStocks: (stocks: Stock[]) => void;
    setSpread: (spread: number[]) => void;
    setPeriodgram: (periodgram: number[]) => void;
}

const options: Option[] = [
    {
        value: Company.YNDX,
        label: 'Яндекс',
    },
    {
        value: Company.SBER,
        label: 'Сбербанк',
    },
    {
        value: Company.GAZP,
        label: 'Газпром',
    },
    {
        value: Company.VTBR,
        label: 'ВТБ',
    },
    {
        value: Company.ROSN,
        label: 'Роснефть',
    },
    {
        value: Company.LKOH,
        label: 'Лукойл',
    },
    {
        value: Company.GMKN,
        label: 'ГМКНорНик',
    },
];

const periodOptions: Option[] = [
    { value: Period.Year, label: 'Год' },
    { value: Period.Half, label: 'Пол года' },
    { value: Period.Quarter, label: 'Квартал' },
    { value: Period.Month, label: 'Месяц' },
];

const MainForm: React.FC<IMainForm> = ({
    className,
    setStocks,
    setSpread,
    setPeriodgram,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, watch } = useForm<FormFields>({
        defaultValues: {
            period: Period.Year,
            stock1: Company.GAZP,
            stock2: Company.SBER,
        },
    });

    const timeFormat = 'YYYY-MM-DD';

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setIsLoading(true);

        const period = {
            [Period.Year]: [1, 'year'],
            [Period.Half]: [6, 'month'],
            [Period.Quarter]: [3, 'month'],
            [Period.Month]: [1, 'month'],
        }[data.period];

        const from = dayjs()
            .subtract(period[0] as number, period[1] as string)
            .format(timeFormat);
        const till = dayjs().format(timeFormat);

        const params: MoexQueryParams = {
            from,
            till,
        };

        try {
            const stock1 = await moexQuery(data.stock1 as Company, params);
            const stock2 = await moexQuery(data.stock2 as Company, params);

            if (stock1 && stock2) {
                const { data: stationarity1 } = await checkStationarity(
                    stock1.data.map((stock) => stock.value)
                );

                if (stationarity1.isStationarity) {
                    throw new Error(`${stock1.code} является стационарным`);
                }

                const { data: stationarity2 } = await checkStationarity(
                    stock2.data.map((stock) => stock.value)
                );

                if (stationarity2.isStationarity) {
                    throw new Error(`${stock2.code} является стационарным`);
                }

                let mergedStock: Stock[] = [];
                const minLength = Math.min(
                    stock1.data.length,
                    stock2.data.length
                );

                for (let i = 0; i < minLength; i++) {
                    mergedStock = [
                        ...mergedStock,
                        {
                            [stock1.code]: stock1.data[i].value,
                            [stock2.code]: stock2.data[i].value,
                            date: stock1.data[i].date,
                        },
                    ];
                }

                setStocks(mergedStock);

                const { data: linearCombination } = await getLinearCombination([
                    mergedStock.map((stock) => stock[stock1.code]) as number[],
                    mergedStock.map((stock) => stock[stock2.code]) as number[],
                ]);

                setSpread(linearCombination.spread);
                setPeriodgram(linearCombination.pxx);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const renderOption = useCallback(
        ({ value, label }: Option) => (
            <MenuItem key={value} value={value}>
                {label}

                <CompanyCode>{value}</CompanyCode>
            </MenuItem>
        ),
        []
    );

    const { stock1, stock2 } = watch();

    return (
        <Container
            className={className}
            label="Основное"
            description={
                <Description>
                    Для продолжения выберите необходимый период, акции и нажмите
                    «Получить данные»
                </Description>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Group>
                    <Select
                        name="period"
                        label="Период"
                        control={control}
                        options={periodOptions}
                    />

                    <Select
                        name="stock1"
                        label="Компания 1"
                        control={control}
                        options={options.filter(
                            (stock) => stock.value !== stock2
                        )}
                        renderOption={renderOption}
                    />

                    <Select
                        name="stock2"
                        label="Компания 2"
                        control={control}
                        options={options.filter(
                            (stock) => stock.value !== stock1
                        )}
                        renderOption={renderOption}
                    />
                </Group>

                <Button type="submit" isLoading={isLoading}>
                    Получить данные
                </Button>
            </form>
        </Container>
    );
};

export default MainForm;
