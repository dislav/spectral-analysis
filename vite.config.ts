import { defineConfig } from 'vite';
import react, { BabelOptions } from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const srcPath = path.join(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    let babelOptions: BabelOptions = {};

    if (isDev)
        babelOptions = {
            ...babelOptions,
            plugins: ['babel-plugin-styled-components'],
        };

    return {
        plugins: [
            react({ babel: babelOptions }),
            VitePWA({
                includeAssets: [
                    'favicon.svg',
                    'robots.txt',
                    'apple-touch-icon.png',
                ],
                manifest: {
                    name: 'Spectrum',
                    short_name: 'Spectrum',
                    description:
                        'A spectrum (plural spectra or spectrums) is a condition that is not limited to a specific set of values but can vary, without gaps, across a continuum. The word was first used scientifically in optics to describe the rainbow of colors in visible light after passing through a prism. As scientific understanding of light advanced, it came to apply to the entire electromagnetic spectrum. It thereby became a mapping of a range of magnitudes (wavelengths) to a range of qualities, which are the perceived "colors of the rainbow" and other properties which correspond to wavelengths that lie outside of the visible light spectrum.',
                    theme_color: '#ffffff',
                    icons: [
                        {
                            src: 'pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                        },
                    ],
                },
            }),
        ],
        resolve: {
            alias: {
                '@api': path.join(srcPath, 'api'),
                '@components': path.join(srcPath, 'components'),
                '@styles': path.join(srcPath, 'styles'),
            },
        },
    };
});
