import { defineConfig } from 'vite'
import react, { BabelOptions } from '@vitejs/plugin-react'
import path from 'path'

const srcPath = path.join(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'

    let babelOptions: BabelOptions = {}

    if (isDev)
        babelOptions = {
            ...babelOptions,
            plugins: ['babel-plugin-styled-components'],
        }

    return {
        plugins: [react({ babel: babelOptions })],
        resolve: {
            alias: {
                '@api': path.join(srcPath, 'api'),
                '@components': path.join(srcPath, 'components'),
                '@styles': path.join(srcPath, 'styles'),
            },
        },
    }
})
