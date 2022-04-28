import axios from 'axios';

import { Company, MoexCandles, MoexQueryParams, MoexResponse } from './types';

export const moexQuery = async (
    company: Company,
    params: MoexQueryParams
): Promise<MoexResponse | null> => {
    try {
        const { data } = await axios.get<MoexCandles>(
            `http://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${company}/candles.json`,
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
