import React, { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, Tooltip } from '@mui/material';

import {
    Company,
    FormFields,
    Method,
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
    Alert,
} from './MainForm.styled';
import Button from '@components/Button/Button';
import Radio from '@components/Radio/Radio';
import Upload from '@components/Upload/Upload';

import { useSpectralAnalysis } from '@components/MainForm/hooks';

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

const Info = (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
        <path
            d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
        />
    </svg>
);

const MainForm: React.FC<IMainForm> = ({
    className,
    setStocks,
    setSpread,
    setPeriodgram,
    onDownloadExcel,
    onClear,
    showControls,
}) => {
    const { handleSubmit, register, control, watch, resetField } =
        useForm<FormFields>({
            defaultValues: {
                period: Period.Year,
                stock1: Company.GAZP,
                stock2: Company.SBER,
                method: Method.Fetch,
            },
        });

    const getCodeError = useCallback((code: string) => {
        const title =
            options.find((option) => option.value === code)?.label || code;

        return `«${title}» является стационарным временным рядом`;
    }, []);

    const [onSubmit, { setError, isLoading, error }] = useSpectralAnalysis(
        setStocks,
        setSpread,
        setPeriodgram,
        onClear,
        getCodeError
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

    useEffect(() => {
        onClearHandler();
        setError(null);
    }, [method]);

    const selfDisabled =
        method === Method.Self && (file === undefined || file?.length === 0);

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
                                        disabled={isLoading}
                                    />
                                    <Radio
                                        label="Данные из файла"
                                        value={Method.Self}
                                        disabled={isLoading}
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
                            disabled={isLoading}
                        />
                        <UploadDescription>
                            Выберите файл формата .json, который содержит два
                            ключа с массивами чисел
                            <Tooltip
                                placement="top"
                                title={
                                    <ExampleTooltip>
                                        Пример файла JSON:
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
                                {Info}
                            </Tooltip>
                        </UploadDescription>
                    </Group>
                )}

                <Footer>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={selfDisabled}
                    >
                        Анализировать данные
                    </Button>

                    {showControls && (
                        <>
                            <Button
                                color="success"
                                onClick={onDownloadExcel}
                                startIcon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        width="22px"
                                        height="22px"
                                    >
                                        <path
                                            d="M 23.576172 4.0664062 C 23.314218 4.0591207 23.047263 4.0824054 22.779297 4.1386719 L 8.5722656 7.1308594 C 6.4998481 7.5683366 5 9.4137099 5 11.533203 L 5 36.466797 C 5 38.585784 6.4983909 40.43285 8.5722656 40.869141 L 22.779297 43.859375 C 24.923297 44.311288 27 42.626019 27 40.435547 L 27 7.5644531 C 27 5.6477898 25.409849 4.117405 23.576172 4.0664062 z M 30 8 L 30 9.5 L 30 11 L 30 38 L 30 39.5 L 30 41 L 38.5 41 C 40.967501 41 43 38.967501 43 36.5 L 43 12.5 C 43 10.032499 40.967501 8 38.5 8 L 30 8 z M 34.5 15 L 37.5 15 C 38.328 15 39 15.671 39 16.5 C 39 17.329 38.328 18 37.5 18 L 34.5 18 C 33.672 18 33 17.329 33 16.5 C 33 15.671 33.672 15 34.5 15 z M 12.537109 16.998047 C 13.02002 17.010742 13.488281 17.251953 13.769531 17.689453 L 16 21.210938 L 18.230469 17.689453 C 18.680469 16.989453 19.610547 16.790469 20.310547 17.230469 C 21.000547 17.680469 21.209531 18.610547 20.769531 19.310547 L 17.779297 24 L 20.769531 28.689453 C 21.209531 29.389453 21.000547 30.319531 20.310547 30.769531 C 20.060547 30.919531 19.78 31 19.5 31 C 19.01 31 18.520469 30.750547 18.230469 30.310547 L 16 26.789062 L 13.769531 30.310547 C 13.479531 30.750547 12.99 31 12.5 31 C 12.22 31 11.939453 30.919531 11.689453 30.769531 C 10.999453 30.319531 10.790469 29.389453 11.230469 28.689453 L 14.220703 24 L 11.230469 19.310547 C 10.790469 18.610547 10.999453 17.680469 11.689453 17.230469 C 11.951953 17.065469 12.247363 16.99043 12.537109 16.998047 z M 34.5 23 L 37.5 23 C 38.328 23 39 23.671 39 24.5 C 39 25.329 38.328 26 37.5 26 L 34.5 26 C 33.672 26 33 25.329 33 24.5 C 33 23.671 33.672 23 34.5 23 z M 34.5 31 L 37.5 31 C 38.328 31 39 31.671 39 32.5 C 39 33.329 38.328 34 37.5 34 L 34.5 34 C 33.672 34 33 33.329 33 32.5 C 33 31.671 33.672 31 34.5 31 z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                }
                            >
                                Скачать
                            </Button>

                            <ClearButton color="error" onClick={onClearHandler}>
                                Очистить
                            </ClearButton>
                        </>
                    )}
                </Footer>

                {error && <Alert severity="error">{error}</Alert>}
            </form>
        </Container>
    );
};

export default MainForm;
