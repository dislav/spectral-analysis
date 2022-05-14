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

/**
 * Функция отправки данных на сервер методом "Данные с биржи".
 *
 * @async
 * @param {FormFields} data Данные формы
 * @param {void} setStocks Функция меняющая состояние временных рядов
 * @param {void} setSpread Функция меняющая состояние спреда
 * @param {void} setPeriodgram Фукнция меняющая состояние периодограммы
 * @param {void} getCodeError Функция получения текста ошибки по коду компании
 * @param options Дополнительные опции
 * @return {Promise<void>}
 */
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
    // Значение периода по его названию
    const period = {
        [Period.Year]: [1, 'year'],
        [Period.Half]: [6, 'month'],
        [Period.Quarter]: [3, 'month'],
        [Period.Month]: [1, 'month'],
    }[data.period];

    // Дата "от"
    const from = dayjs()
        .subtract(period[0] as number, period[1] as string)
        .format(options.timeFormat);

    // Текущая дата
    const till = dayjs().format(options.timeFormat);

    // Объект параметров, который позже передается в запрос
    const params: MoexQueryParams = {
        from,
        till,
    };

    // Запросы на сайт Московской биржы по выбранным компаниям
    const stock1 = await moexQuery(data.stock1 as Company, params);
    const stock2 = await moexQuery(data.stock2 as Company, params);

    // Проверка, что обе компании вернулись
    if (stock1 && stock2) {
        // Отправка запроса на стационарность к серверной части программы
        // Значения первой компании
        const { data: stationarity1 } = await checkStationarity(
            stock1.data.map((stock) => stock.value)
        );

        // Если isStationarity === true (временной ряд стационарный),
        // то вызвать ошибку с текстом обработанным в функции getCodeError
        if (stationarity1.isStationarity) {
            throw new Error(getCodeError(stock1.code));
        }

        // Отправка запроса на стационарность к серверной части программы
        // Значения второй компании
        const { data: stationarity2 } = await checkStationarity(
            stock2.data.map((stock) => stock.value)
        );

        // Если isStationarity === true (временной ряд стационарный),
        // то вызвать ошибку с текстом обработанным в функции getCodeError
        if (stationarity2.isStationarity) {
            throw new Error(getCodeError(stock2.code));
        }

        // Создание пустово массива с "слитыми" массивами
        let mergedStock: Stock[] = [];

        // Нахождение минимальной длины массива, чтобы позже
        // избежать ошибки на серверной части из-за разных длин
        const minLength = Math.min(stock1.data.length, stock2.data.length);

        // Прохождение по элементам двух массивов и добавление
        // их в общий - mergedStock
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

        // Изменение состояния временных рядов
        setStocks(mergedStock);

        // Отправка запроса для получения линейно комбинации,
        // преобразование временных рядов в нужному формату
        const { data: linearCombination } = await getLinearCombination([
            mergedStock.map((stock) => stock[stock1.code]) as number[],
            mergedStock.map((stock) => stock[stock2.code]) as number[],
        ]);

        // Изменение состояния спреда
        setSpread(linearCombination.spread);

        // Изменение состояния периодограммы
        setPeriodgram(linearCombination.pxx);
    }
};

/**
 * Функция отправки данных на сервер методом "Данные из файла".
 *
 * @async
 * @param {FileReader} fileReader Объект FileReader позволяет веб-приложениям асинхронно читать содержимое файлов (или буферы данных), хранящиеся на компьютере пользователя
 * @param {void} setStocks Функция меняющая состояние временных рядов
 * @param {void} setSpread Функция меняющая состояние спреда
 * @param {void} setPeriodgram Фукнция меняющая состояние периодограммы
 * @param {void} getCodeError Функция получения текста ошибки по коду компании
 * @return {Promise<void>}
 */
export const calculateSelfMethod: CalculateSelfMethod = async (
    fileReader,
    setStocks,
    setSpread,
    setPeriodgram,
    getCodeError
) => {
    // Парсинг JSON файла, который загрузил пользователь
    const parsedFile = JSON.parse(fileReader.result as string);

    // Получение ключей (название временных рядов) из файла
    const [code1, code2] = Object.keys(parsedFile);

    // Отправка запроса на стационарность к серверной части программы
    // Значения первой компании
    const { data: stationarity1 } = await checkStationarity(parsedFile[code1]);

    // Если isStationarity === true (временной ряд стационарный),
    // то вызвать ошибку с текстом обработанным в функции getCodeError
    if (stationarity1.isStationarity) {
        throw new Error(getCodeError(code1));
    }

    // Отправка запроса на стационарность к серверной части программы
    // Значения второй компании
    const { data: stationarity2 } = await checkStationarity(parsedFile[code2]);

    // Если isStationarity === true (временной ряд стационарный),
    // то вызвать ошибку с текстом обработанным в функции getCodeError
    if (stationarity2.isStationarity) {
        throw new Error(getCodeError(code2));
    }

    // Создание пустово массива с "слитыми" массивами
    let mergedStock: Stock[] = [];

    // Нахождение минимальной длины массива, чтобы позже
    // избежать ошибки на серверной части из-за разных длин
    const minLength = Math.min(
        parsedFile[code1].length,
        parsedFile[code2].length
    );

    // Прохождение по элементам двух массивов и добавление
    // их в общий массив - mergedStock
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

    // Изменение состояния временных рядов
    setStocks(mergedStock);

    // Отправка запроса для получения линейно комбинации,
    // преобразование временных рядов в нужному формату
    const { data: linearCombination } = await getLinearCombination([
        parsedFile[code1],
        parsedFile[code2],
    ]);

    // Изменение состояния спреда
    setSpread(linearCombination.spread);

    // Изменение состояния периодограммы
    setPeriodgram(linearCombination.pxx);
};
