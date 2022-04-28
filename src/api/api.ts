import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

export const checkStationarity = (data: number[]) =>
    axiosInstance.post<{ isStationarity: boolean }>('/stationarity', data);

export const getLinearCombination = (data: number[][]) =>
    axiosInstance.post<{
        isStationarity: boolean;
        spread: number[];
        covariance: number;
    }>('/linear-combination', data);
