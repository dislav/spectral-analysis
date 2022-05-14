import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';

import {
    Company,
    FormFields,
    MoexCandles,
    MoexQueryParams,
    MoexResponse,
    Period,
} from './types';
import { Stock } from '@components/App/types';
import { checkStationarity, getLinearCombination } from '@api/api';

type CalculateFetchMethod = (
    data: FormFields,
    setStocks: (stocks: Stock[]) => void,
    setSpread: (spread: number[]) => void,
    setPeriodgram: (periodgram: number[]) => void,
    getCodeError: (code: string) => string,
    options?: { timeFormat: string }
) => Promise<void>;

type CalculateSelfMethod = (
    fileReader: FileReader,
    setStocks: (stocks: Stock[]) => void,
    setSpread: (spread: number[]) => void,
    setPeriodgram: (periodgram: number[]) => void,
    getCodeError: (code: string) => string
) => Promise<void>;

export const moexQuery = async (
    company: Company,
    params: MoexQueryParams
): Promise<MoexResponse | null> => {
    try {
        const { data } = await axios.get<MoexCandles>(
            `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${company}/candles.json`,
            {
                params: {
                    ...params,
                    interval: 24,
                    start: 0,
                },
            }
        );

        return {
            code: company,
            data: data.candles.data.map((candle) => ({
                value: candle[1],
                date: candle[7].split(' ')[0],
            })),
        };
    } catch (e) {
        console.log(e);

        return null;
    }
};

export const isAxiosError = <T>(
    error: unknown | AxiosError<T>
): error is AxiosError<T> => (error as AxiosError).response !== undefined;

export const calculateFetchMethod: CalculateFetchMethod = async (
    data,
    setStocks,
    setSpread,
    setPeriodgram,
    getCodeError,
    options = {
        timeFormat: 'YYYY-MM-DD',
    }
) => {
    const period = {
        [Period.Year]: [1, 'year'],
        [Period.Half]: [6, 'month'],
        [Period.Quarter]: [3, 'month'],
        [Period.Month]: [1, 'month'],
    }[data.period];

    const from = dayjs()
        .subtract(period[0] as number, period[1] as string)
        .format(options.timeFormat);
    const till = dayjs().format(options.timeFormat);

    const params: MoexQueryParams = {
        from,
        till,
    };

    const stock1 = await moexQuery(data.stock1 as Company, params);
    const stock2 = await moexQuery(data.stock2 as Company, params);

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
        const minLength = Math.min(stock1.data.length, stock2.data.length);

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
};

export const calculateSelfMethod: CalculateSelfMethod = async (
    fileReader,
    setStocks,
    setSpread,
    setPeriodgram,
    getCodeError
) => {
    const parsedFile = JSON.parse(fileReader.result as string);
    const [code1, code2] = Object.keys(parsedFile);

    const { data: stationarity1 } = await checkStationarity(parsedFile[code1]);

    if (stationarity1.isStationarity) {
        throw new Error(getCodeError(code1));
    }

    const { data: stationarity2 } = await checkStationarity(parsedFile[code2]);

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

    const { data: linearCombination } = await getLinearCombination([
        parsedFile[code1],
        parsedFile[code2],
    ]);

    setSpread(linearCombination.spread);
    setPeriodgram(linearCombination.pxx);
};
