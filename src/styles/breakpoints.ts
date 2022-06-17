export enum Breakpoint {
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    XXL = 'xxl',
}

export const breakpoints = {
    [Breakpoint.SM]: 640,
    [Breakpoint.MD]: 768,
    [Breakpoint.LG]: 1024,
    [Breakpoint.XL]: 1280,
    [Breakpoint.XXL]: 1536,
};

export const up = (breakpoint: Breakpoint) =>
    `@media screen and (min-width: ${breakpoints[breakpoint]}px)`;
