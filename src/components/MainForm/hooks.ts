import { useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { FormFields, Method } from '@components/MainForm/types';
import { Stock } from '@components/App/types';

import {
    calculateFetchMethod,
    calculateSelfMethod,
    isAxiosError,
} from '@components/MainForm/utils';

type SpectralAnalysis = (
    setStocks: (stocks: Stock[]) => void,
    setSpread: (spread: number[]) => void,
    setPeriodgram: (periodgram: number[]) => void,
    onClear: () => void,
    getCodeError: (code: string) => string
) => [
    SubmitHandler<FormFields>,
    {
        setError: (error: string | null) => void;
        isLoading: boolean;
        error: string | null;
    }
];

export const useSpectralAnalysis: SpectralAnalysis = (
    setStocks,
    setSpread,
    setPeriodgram,
    onClear,
    getCodeError
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormFields> = useCallback(
        async (data) => {
            onClear();

            setIsLoading(true);
            setError(null);

            if (data.method === Method.Fetch) {
                try {
                    await calculateFetchMethod(
                        data,
                        setStocks,
                        setSpread,
                        setPeriodgram,
                        getCodeError
                    );

                    setIsLoading(false);
                } catch (e) {
                    const axiosError = isAxiosError<{ messages: string[] }>(e);

                    if (axiosError && e.response) {
                        setError(e.response.data.messages[0]);
                    } else {
                        setError((e as Error).message);
                    }

                    setIsLoading(false);
                }
            } else {
                const fileReader = new FileReader();

                try {
                    fileReader.onload = async () => {
                        try {
                            await calculateSelfMethod(
                                fileReader,
                                setStocks,
                                setSpread,
                                setPeriodgram,
                                getCodeError
                            );

                            setIsLoading(false);
                        } catch (e) {
                            const axiosError = isAxiosError<{
                                messages: string[];
                            }>(e);

                            if (axiosError && e.response) {
                                setError(e.response.data.messages[0]);
                            } else {
                                setError((e as Error).message);
                            }

                            setIsLoading(false);
                        }
                    };

                    fileReader.readAsText(data.file[0]);
                } catch (e) {
                    setError('Не выбран файл с данными');
                    setIsLoading(false);
                }
            }
        },
        [isLoading, error]
    );

    return [
        onSubmit,
        {
            setError,
            isLoading,
            error,
        },
    ];
};
