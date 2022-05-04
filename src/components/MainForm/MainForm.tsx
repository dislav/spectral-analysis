import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

import {
    Company,
    FormFields,
    Method,
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
    UploadDescription,
    ExampleTooltip,
    Footer,
    ClearButton,
    Errors,
} from './MainForm.styled';
import Button from '@components/Button/Button';
import Radio from '@components/Radio/Radio';
import Upload from '@components/Upload/Upload';

import { moexQuery } from '@components/MainForm/utils';
import { checkStationarity, getLinearCombination } from '@api/api';

interface IMainForm {
    className?: string;
    setStocks: (stocks: Stock[]) => void;
    setSpread: (spread: number[]) => void;
    setPeriodgram: (periodgram: number[]) => void;
    onDownloadExcel: () => void;
    onClear: () => void;
    showControls?: boolean;
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
    onDownloadExcel,
    onClear,
    showControls,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { handleSubmit, register, control, watch, resetField } = useForm<FormFields>({
        defaultValues: {
            period: Period.Year,
            stock1: Company.GAZP,
            stock2: Company.SBER,
            method: Method.Fetch,
        },
    });

    const timeFormat = 'YYYY-MM-DD';

    const getCodeError = useCallback((code: string) => {
        const title =
            options.find((option) => option.value === code)?.label || code;

        return `«${title}» является стационарным временным рядом`;
    }, []);

    const onSubmit: SubmitHandler<FormFields> = useCallback(
        async (data) => {
            onClear();

            setIsLoading(true);
            setError(null);

            if (data.method === Method.Fetch) {
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
                    const stock1 = await moexQuery(
                        data.stock1 as Company,
                        params
                    );
                    const stock2 = await moexQuery(
                        data.stock2 as Company,
                        params
                    );

                    if (stock1 && stock2) {
                        const { data: stationarity1 } = await checkStationarity(
                            stock1.data.map((stock) => stock.value)
                        );

                        if (stationarity1.isStationarity) {
                            throw new Error(getCodeError(stock1.code));
                        }

                        const { data: stationarity2 } = await checkStationarity(
                            stock2.data.map((stock) => stock.value)
                        );

                        if (stationarity2.isStationarity) {
                            throw new Error(getCodeError(stock2.code));
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

                        const { data: linearCombination } =
                            await getLinearCombination([
                                mergedStock.map(
                                    (stock) => stock[stock1.code]
                                ) as number[],
                                mergedStock.map(
                                    (stock) => stock[stock2.code]
                                ) as number[],
                            ]);

                        setSpread(linearCombination.spread);
                        setPeriodgram(linearCombination.pxx);
                    }

                    setIsLoading(false);
                } catch (e) {
                    setError((e as Error).message);
                    setIsLoading(false);
                }
            } else {
                const fileReader = new FileReader();

                fileReader.onload = async () => {
                    try {
                        const parsedFile = JSON.parse(
                            fileReader.result as string
                        );
                        const [code1, code2] = Object.keys(parsedFile);

                        const { data: stationarity1 } = await checkStationarity(
                            parsedFile[code1]
                        );

                        if (stationarity1.isStationarity) {
                            throw new Error(getCodeError(code1));
                        }

                        const { data: stationarity2 } = await checkStationarity(
                            parsedFile[code2]
                        );

                        if (stationarity2.isStationarity) {
                            throw new Error(getCodeError(code2));
                        }

                        let mergedStock: Stock[] = [];
                        const minLength = Math.min(
                            parsedFile[code1].length,
                            parsedFile[code2].length
                        );

                        for (let i = 0; i < minLength; i++) {
                            mergedStock = [
                                ...mergedStock,
                                {
                                    [code1]: parsedFile[code1][i],
                                    [code2]: parsedFile[code2][i],
                                    date: i,
                                },
                            ];
                        }

                        setStocks(mergedStock);

                        const { data: linearCombination } =
                            await getLinearCombination([
                                parsedFile[code1],
                                parsedFile[code2],
                            ]);

                        setSpread(linearCombination.spread);
                        setPeriodgram(linearCombination.pxx);

                        setIsLoading(false);
                    } catch (e) {
                        setError((e as Error).message);
                        setIsLoading(false);
                    }
                };

                fileReader.readAsText(data.file[0]);
            }
        },
        [setStocks, setSpread, setPeriodgram, onClear, isLoading, error]
    );

    const renderOption = useCallback(
        ({ value, label }: Option) => (
            <MenuItem key={value} value={value}>
                {label}

                <CompanyCode>{value}</CompanyCode>
            </MenuItem>
        ),
        []
    );

    const onClearHandler = useCallback(() => {
        onClear();
        resetField('file');
    }, [onClear, resetField]);

    const { stock1, stock2, method, file } = watch();

    return (
        <Container className={className} label="Основное">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Group>
                    <Controller
                        name="method"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <FormControl>
                                <FormLabel>Метод загрузки данных</FormLabel>
                                <RadioGroup
                                    value={value}
                                    onChange={onChange}
                                    row
                                >
                                    <Radio
                                        label="Данные с биржи"
                                        value={Method.Fetch}
                                    />
                                    <Radio
                                        label="Данные из файла"
                                        value={Method.Self}
                                    />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </Group>

                {method === Method.Fetch ? (
                    <Group>
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

                        <Select
                            name="period"
                            label="Период"
                            control={control}
                            options={periodOptions}
                        />
                    </Group>
                ) : (
                    <Group>
                        <Upload
                            {...register('file')}
                            accept="application/json"
                            fileName={file?.[0]?.name || null}
                        />

                        <Tooltip
                            placement="top"
                            title={
                                <ExampleTooltip>
                                    Пример:
                                    <pre>
                                        <code
                                            dangerouslySetInnerHTML={{
                                                __html: `{\n  "stock1": [4, 40, 32, ...],\n  "stock2": [6, 2, 1, ...]\n}`,
                                            }}
                                        />
                                    </pre>
                                </ExampleTooltip>
                            }
                            arrow
                        >
                            <UploadDescription>
                                Выберите файл формата .json, который содержит
                                два ключа с массивами чисел
                            </UploadDescription>
                        </Tooltip>
                    </Group>
                )}

                <Footer>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={
                            method === Method.Self &&
                            (file === undefined || file?.length === 0)
                        }
                    >
                        Анализировать данные
                    </Button>

                    {showControls && (
                        <>
                            <Button color="success" onClick={onDownloadExcel}>
                                Скачать в Excel
                            </Button>

                            <ClearButton color="error" onClick={onClearHandler}>
                                Очистить
                            </ClearButton>
                        </>
                    )}
                </Footer>

                {error && (
                    <Errors>
                        <ul>
                            <li>{error}</li>
                        </ul>
                    </Errors>
                )}
            </form>
        </Container>
    );
};

export default MainForm;
