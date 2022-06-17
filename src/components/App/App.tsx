import React, { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { roundTo } from 'round-to';
import * as xlsx from 'xlsx';

import { Stock } from '@components/App/types';
import { Breakpoint, breakpoints } from '@styles/breakpoints';

import { Container, Group, Label, TooltipApp } from './App.styled';

import Header from '@components/Header/Header';
import MainForm from '@components/MainForm/MainForm';

const App: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [spread, setSpread] = useState<number[]>([]);
    const [periodgram, setPeriodgram] = useState<number[]>([]);

    const keys = useMemo(() => {
        if (stocks.length)
            return Object.keys(stocks[0]).filter((key) => key !== 'date');

        return [];
    }, [stocks]);

    const arrayByKey = (key: string, array: number[]) =>
        array.map((v) => ({ [key]: v }));

    const onDownloadExcel = () => {
        const workbook = xlsx.utils.book_new();

        const stockSheet = xlsx.utils.json_to_sheet(stocks);
        const spreadSheet = xlsx.utils.json_to_sheet(
            spread.map((v) => ({ spread: v }))
        );
        const periodSheet = xlsx.utils.json_to_sheet(
            periodgram.map((v) => ({ periodgram: v }))
        );

        xlsx.utils.book_append_sheet(workbook, stockSheet, 'Временные ряды');
        xlsx.utils.book_append_sheet(workbook, spreadSheet, 'Спред');
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

    return (
        <>
            <Header />

            <Container>
                <MainForm
                    setStocks={setStocks}
                    setSpread={setSpread}
                    setPeriodgram={setPeriodgram}
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
                                    textAnchor="end"
                                    angle={-45}
                                    height={90}
                                    interval={isMobile ? 30 : 8}
                                />
                                <YAxis tickCount={8} />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey={keys[0]}
                                    stroke="#ec3c3c"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={keys[1]}
                                    stroke="#3a88e1"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Group>
                )}

                {spread.length > 0 && (
                    <Group
                        label={
                            <Label>
                                Спред
                                <TooltipApp title="Спред — разность между двумя временными рядами в один и тот же момент времени." />
                            </Label>
                        }
                    >
                        <ResponsiveContainer width="100%" height={graphHeight}>
                            <LineChart data={arrayByKey('spread', spread)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis />
                                <YAxis tickCount={8} />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="spread"
                                    stroke="#8c2de8"
                                    dot={false}
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
                                    interval={isMobile ? 'preserveStart' : 4}
                                />
                                <YAxis
                                    scale="log"
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(value) =>
                                        value.toString().length > 5
                                            ? roundTo(value, 3)
                                            : value
                                    }
                                />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="periodgram"
                                    stroke="#e82dad"
                                    dot={false}
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
