import React, { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { roundTo } from 'round-to';
import * as xlsx from 'xlsx';

import { Stock } from '@components/App/types';
import { Breakpoint, breakpoints } from '@styles/breakpoints';
import { Method } from '@components/MainForm/types';

import { Container, Group, Label, TooltipApp } from './App.styled';

import Header from '@components/Header/Header';
import MainForm from '@components/MainForm/MainForm';

const App: React.FC = () => {
    const [method, setMethod] = useState<Method>(Method.Fetch);

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [spread, setSpread] = useState<number[]>([]);
    const [periodgram, setPeriodgram] = useState<number[]>([]);

    const keys = useMemo(() => {
        if (stocks.length)
            return Object.keys(stocks[0]).filter((key) => key !== 'date');

        return [];
    }, [stocks]);

    const arrayByKey = (
        key: string,
        array: number[],
        cb?: (index: number) => { [key: string]: any }
    ) => array.map((v, index) => ({ [key]: v, ...(cb?.(index) ?? {}) }));

    const spreadValues = arrayByKey('spread', spread, (index) => ({
        date: stocks[index].date,
    }));

    const onDownloadExcel = () => {
        const workbook = xlsx.utils.book_new();

        const stockSheet = xlsx.utils.json_to_sheet(stocks);
        const spreadSheet = xlsx.utils.json_to_sheet(spreadValues);
        const periodSheet = xlsx.utils.json_to_sheet(
            periodgram.map((v) => ({ periodgram: v }))
        );

        xlsx.utils.book_append_sheet(workbook, stockSheet, 'Временные ряды');
        xlsx.utils.book_append_sheet(
            workbook,
            spreadSheet,
            'Линейная комбинация'
        );
        xlsx.utils.book_append_sheet(workbook, periodSheet, 'Периодограмма');

        xlsx.writeFile(workbook, 'spectral-analysis.xlsx');
    };

    const onClear = () => {
        setStocks([]);
        setSpread([]);
        setPeriodgram([]);
    };

    const isMobile = useMediaQuery({ maxWidth: breakpoints[Breakpoint.MD] });
    const graphHeight = isMobile ? 360 : 460;

    const stocksDesktopInterval = stocks.length > 104 ? 8 : 4;
    const spreadDesktopInterval = spread.length > 104 ? 8 : 4;
    const periodogramDesktopInterval = periodgram.length > 52 ? 4 : 2;

    const isFetchMethod = method === Method.Fetch;
    const xAxisAngle = isFetchMethod ? -45 : 0;

    return (
        <>
            <Header />

            <Container>
                <MainForm
                    setStocks={setStocks}
                    setSpread={setSpread}
                    setPeriodgram={setPeriodgram}
                    setMethod={setMethod}
                    onDownloadExcel={onDownloadExcel}
                    onClear={onClear}
                    showControls={!!periodgram.length}
                />

                {stocks.length > 0 && (
                    <Group
                        label={
                            <Label>
                                Временные ряды (Котировки акций)
                                <TooltipApp title="Временной ряд (динамический ряд, ряд динамики) — собранный в разные моменты времени статистический материал о значении каких-либо параметров (в простейшем случае одного) исследуемого процесса." />
                            </Label>
                        }
                    >
                        <ResponsiveContainer width="100%" height={graphHeight}>
                            <LineChart data={stocks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    height={isFetchMethod ? 90 : 44}
                                    interval={
                                        isMobile ? 30 : stocksDesktopInterval
                                    }
                                    textAnchor="end"
                                    angle={xAxisAngle}
                                    label={{
                                        value: 'Время',
                                        position: 'insideBottomRight',
                                        offset: 0,
                                    }}
                                />
                                <YAxis
                                    tickCount={8}
                                    label={{
                                        value: 'Цена',
                                        angle: -90,
                                        position: 'insideLeft',
                                    }}
                                />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey={keys[0]}
                                    stroke="#ec3c3c"
                                    dot={false}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    activeDot={{ r: 7, strokeWidth: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={keys[1]}
                                    stroke="#3a88e1"
                                    dot={false}
                                    strokeWidth={3.5}
                                    strokeDasharray="8 8"
                                    strokeLinecap="round"
                                    activeDot={{ r: 7, strokeWidth: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Group>
                )}

                {spread.length > 0 && (
                    <Group
                        label={
                            <Label>
                                Линейная комбинация
                                <TooltipApp
                                    title={
                                        <>
                                            Линейная комбинация — выражение,
                                            построенное на множестве элементов
                                            путём умножения каждого элемента на
                                            коэффициенты с последующим сложением
                                            результатов
                                            <br />
                                            <br />
                                            <i>L – линейная комбинация</i>
                                        </>
                                    }
                                />
                            </Label>
                        }
                    >
                        <ResponsiveContainer width="100%" height={graphHeight}>
                            <LineChart data={spreadValues}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    height={isFetchMethod ? 90 : 44}
                                    interval={
                                        isMobile
                                            ? 'preserveStart'
                                            : spreadDesktopInterval
                                    }
                                    textAnchor="end"
                                    angle={xAxisAngle}
                                    label={{
                                        value: 'Время',
                                        position: 'insideBottomRight',
                                        offset: 0,
                                    }}
                                />
                                <YAxis
                                    tickCount={8}
                                    label={{
                                        value: 'Значение L',
                                        angle: -90,
                                        position: 'insideLeft',
                                    }}
                                />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="spread"
                                    stroke="#8c2de8"
                                    dot={false}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    activeDot={{ r: 7, strokeWidth: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Group>
                )}

                {periodgram.length > 0 && (
                    <Group
                        label={
                            <Label>
                                Периодограмма
                                <TooltipApp title="Периодограмма — оценка спектральной плотности мощности (СПМ), основанная на вычислении квадрата модуля преобразования Фурье последовательности данных." />
                            </Label>
                        }
                    >
                        <ResponsiveContainer width="100%" height={graphHeight}>
                            <LineChart
                                data={arrayByKey('periodgram', periodgram)}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    height={44}
                                    interval={
                                        isMobile
                                            ? 'preserveStart'
                                            : periodogramDesktopInterval
                                    }
                                    label={{
                                        value: 'Частота',
                                        position: 'insideBottomRight',
                                        offset: 0,
                                    }}
                                />
                                <YAxis
                                    scale="log"
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(value) =>
                                        value.toString().length > 5
                                            ? roundTo(value, 3)
                                            : value
                                    }
                                    label={{
                                        value: 'Спектр',
                                        angle: -90,
                                        position: 'insideLeft',
                                    }}
                                />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="periodgram"
                                    stroke="#e82dad"
                                    dot={false}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    activeDot={{ r: 7, strokeWidth: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Group>
                )}
            </Container>
        </>
    );
};

export default App;
