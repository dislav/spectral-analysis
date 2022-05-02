import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://specapi.studio-mind.ru',
});

export const checkStationarity = (data: number[]) =>
    axiosInstance.post<{ isStationarity: boolean }>('/stationarity', data);

export const getLinearCombination = (data: number[][]) =>
    axiosInstance.post<{
        isStationarity: boolean;
        spread: number[];
        pxx: number[];
        covariance: number;
    }>('/linear-combination', data);
