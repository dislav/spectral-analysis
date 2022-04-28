export interface FormFields {
    stock1: string;
    stock2: string;
    period: Period;
}

export enum Company {
    SBER = 'SBER',
    GAZP = 'GAZP',
    LKOH = 'LKOH',
    YNDX = 'YNDX',
    VTBR = 'VTBR',
    ROSN = 'ROSN',
    GMKN = 'GMKN',
}

export enum Period {
    Year = 'year',
    Half = 'half',
    Quarter = 'quarter',
    Month = 'month',
}

export interface MoexQueryParams {
    from: string;
    till: string;
}

export interface MoexResponse {
    code: string;
    data: {
        value: number;
        date: string;
    }[];
}

export interface MoexCandles {
    candles: {
        columns: string[];
        data: [
            open: number,
            close: number,
            high: number,
            low: number,
            value: number,
            volume: number,
            begin: string,
            end: string
        ][];
    };
}
