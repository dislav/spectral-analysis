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

import { Stock } from '@components/App/types';

import { Container, Group } from './App.styled';

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

    return (
        <>
            <Header />

            <Container>
                <MainForm
                    setStocks={setStocks}
                    setSpread={setSpread}
                    setPeriodgram={setPeriodgram}
                />

                {stocks.length > 0 && (
                    <Group label="Графики">
                        <ResponsiveContainer width="100%" height={460}>
                            <LineChart data={stocks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
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
                    <Group label="Spread">
                        <ResponsiveContainer width="100%" height={460}>
                            <LineChart data={arrayByKey('spread', spread)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis />
                                <YAxis />
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
                    <Group label="Периодограмма">
                        <ResponsiveContainer width="100%" height={460}>
                            <LineChart
                                data={arrayByKey('periodgram', periodgram)}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis />
                                <YAxis
                                    scale="log"
                                    domain={['dataMin', 'dataMax']}
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
